"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/ui/site-link";
import { getConsent, initializeConsent, saveConsent, serverConsent, subscribeConsent, visitPage } from "@/lib/analytics-consent";
import s from "./legal.module.css";

export function CookiePreferences() {
  const choice = useSyncExternalStore(subscribeConsent, getConsent, serverConsent);
  const pathname = usePathname();
  const [message, setMessage] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(initializeConsent, []);
  useEffect(() => { visitPage(pathname); }, [pathname]);
  function close() { dialog.current?.close(); trigger.current?.focus(); }
  function choose(value: "granted" | "denied") {
    const saved = saveConsent(value);
    setMessage(saved
      ? (value === "granted" ? "Analytics is on. Your preference has been saved." : "Analytics is off. Your preference has been saved.")
      : value === "granted"
        ? "Your browser could not save your choice. Analytics remains off."
        : "Analytics is off for this page. If your browser could not clear the saved choice, clear site data before continuing.");
    if (dialog.current?.open) close(); else trigger.current?.focus({ preventScroll: true });
  }
  const buttons = <div className={s.consentActions}>
    <button type="button" onClick={() => choose("granted")}>Accept analytics</button>
    <button type="button" onClick={() => choose("denied")}>Reject optional</button>
  </div>;
  return <><button ref={trigger} className={s.trigger} type="button" aria-haspopup="dialog" disabled={choice === "loading"} onClick={() => { dialog.current?.showModal(); closeButton.current?.focus(); }}>Cookie preferences</button>
    <span role="status" className={s.consentStatus}>{message}</span>
    {choice === "undecided" && <section className={s.consentBanner} aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-description">
      <h2 id="cookie-banner-title">Your cookie choice</h2>
      <p id="cookie-banner-description">May we use optional Google Analytics cookies to understand page visits? Analytics stays off until you accept. Rejecting does not affect the website, forms or kit downloads. Change your choice anytime in Cookie preferences.</p>
      <Link href="/cookie-policy">Read the Cookie Policy</Link>{buttons}
    </section>}
    <dialog ref={dialog} className={s.dialog} aria-labelledby="cookie-preferences-title" aria-describedby="cookie-preferences-description" onCancel={event => { event.preventDefault(); close(); }} onKeyDown={event => {
      if (event.key !== "Tab") return;
      const controls = dialog.current?.querySelectorAll<HTMLElement>("a[href], button");
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}><h2 id="cookie-preferences-title">Cookie preferences</h2>
      <p id="cookie-preferences-description">Necessary technologies support website security and form verification. Optional Google Analytics measures page visits only after you accept. Advertising consent stays off. Cloudflare server-side aggregate request counts operate independently of this choice.</p>
      <p>Analytics: <strong>{choice === "granted" ? "Accepted" : choice === "denied" ? "Rejected" : "Not decided (disabled)"}</strong>. Your choice is remembered for 180 days on this browser when local storage is available.</p>
      <p>Reject optional to withdraw analytics consent. Future collection stops and accessible first-party GA cookies are removed. Withdrawal cannot undo previously processed data or recall requests already sent. Already loaded Google code is removed with its isolated frame.</p>
      <p>Form answers and contact details are never passed to analytics. Form follow-up and marketing permissions are separate.</p>
      <Link href="/cookie-policy">Read the Cookie Policy</Link>{buttons}
      <button ref={closeButton} type="button" className={s.close} onClick={close}>Close cookie preferences</button>
    </dialog></>;
}
