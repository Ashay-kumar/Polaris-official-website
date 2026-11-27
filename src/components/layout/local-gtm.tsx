"use client";

import { useEffect } from "react";
import { CONSENT_KEY, getConsent, parseConsent, subscribeConsent } from "@/lib/analytics-consent";

const enabled = process.env.NEXT_PUBLIC_KYRO_LOCAL_GTM === "1";
const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
const containerDocument = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="referrer" content="no-referrer">
<title>Local tag manager</title>
<script>
window.addEventListener("message", function start(event) {
  if (event.source !== window.parent || event.data !== "kyro-start-local-gtm") return;
  window.removeEventListener("message", start);
  window.dataLayer = [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("consent", "default", {
    analytics_storage: "denied", ad_storage: "denied",
    ad_user_data: "denied", ad_personalization: "denied"
  });
  gtag("consent", "update", { analytics_storage: "granted" });
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.referrerPolicy = "no-referrer";
  script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-TCH3MJZH";
  document.head.append(script);
});
</script></head><body></body></html>`;

function hasValidGrant() {
  if (getConsent() !== "granted") return false;
  try {
    return parseConsent(localStorage.getItem(CONSENT_KEY))?.choice === "granted";
  } catch {
    return false;
  }
}

export function LocalGtm() {
  useEffect(() => {
    const production = location.origin === "https://kyrolearning.com";
    if (!production && !(enabled && loopbackHosts.has(location.hostname))) return;

    let frame: HTMLIFrameElement | undefined;
    let suspended = false;
    let disposed = false;

    function stop() {
      // Discard the browsing context, including the executed container and its listeners.
      frame?.remove();
      frame = undefined;
    }

    function reconcile() {
      if (disposed || suspended || !hasValidGrant()) {
        stop();
        return;
      }
      if (frame) return;
      const documentFrame = document.createElement("iframe");
      documentFrame.hidden = true;
      documentFrame.title = "Local Google Tag Manager";
      documentFrame.setAttribute("sandbox", "allow-scripts");
      documentFrame.referrerPolicy = "no-referrer";
      documentFrame.srcdoc = containerDocument;
      documentFrame.addEventListener("load", () => {
        if (frame === documentFrame && hasValidGrant()) {
          // An opaque-origin frame requires "*". This message carries no visitor data.
          documentFrame.contentWindow?.postMessage("kyro-start-local-gtm", "*");
        }
      }, { once: true });
      frame = documentFrame;
      document.body.append(documentFrame);
    }

    function suspend() {
      suspended = true;
      stop();
    }

    function resume() {
      suspended = false;
      reconcile();
    }

    const unsubscribe = subscribeConsent(reconcile);
    window.addEventListener("pagehide", suspend);
    window.addEventListener("pageshow", resume);
    // Defer startup until after the initial effects, including development Strict Mode cleanup.
    queueMicrotask(reconcile);

    return () => {
      disposed = true;
      unsubscribe();
      window.removeEventListener("pagehide", suspend);
      window.removeEventListener("pageshow", resume);
      stop();
    };
  }, []);

  return null;
}
