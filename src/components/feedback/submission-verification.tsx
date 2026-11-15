"use client";
import { useEffect, useRef, useState } from "react";
import { formConfiguration, type FormKind } from "@/lib/form-submission";

type Turnstile = { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }
let loading: Promise<void> | undefined;
function load() {
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true; script.onload = () => resolve(); script.onerror = () => { loading = undefined; reject(new Error("Verification unavailable")); }; document.head.appendChild(script);
  });
  return loading;
}
export function SubmissionVerification({ kind, onToken }: { kind: FormKind; onToken: (token: string) => void }) {
  const element = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false, widget: string | undefined;
    load().then(() => {
      if (disposed || !element.current || !window.turnstile) return;
      widget = window.turnstile.render(element.current, { sitekey: formConfiguration.siteKey, action: kind, callback: onToken, "expired-callback": () => onToken(""), "error-callback": () => { onToken(""); setFailed(true); } });
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; if (widget) window.turnstile?.remove(widget); };
  }, [kind, onToken]);
  return <div><div ref={element} aria-label="Submission verification" />{failed && <p role="alert">Verification could not load. Refresh the page or try again later. Your details have not been sent.</p>}</div>;
}
