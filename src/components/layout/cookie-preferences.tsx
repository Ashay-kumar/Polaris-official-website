"use client";
import { useRef } from "react";
import Link from "@/components/ui/site-link";
import s from "./legal.module.css";

export function CookiePreferences() {
  const dialog = useRef<HTMLDialogElement>(null), trigger = useRef<HTMLButtonElement>(null);
  function close() { dialog.current?.close(); trigger.current?.focus(); }
  return <><button ref={trigger} className={s.trigger} type="button" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>Cookie preferences</button>
    <dialog ref={dialog} className={s.dialog} aria-labelledby="cookie-preferences-title" aria-describedby="cookie-preferences-description" onCancel={event => { event.preventDefault(); close(); }} onKeyDown={event => {
      if (event.key !== "Tab") return;
      const controls = dialog.current?.querySelectorAll<HTMLElement>("a[href], button");
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}><h2 id="cookie-preferences-title">Cookie preferences</h2>
      <p id="cookie-preferences-description">Only necessary technologies are used. No optional analytics or advertising tools are enabled, so there are no optional cookie choices to save.</p>
      <p>Necessary technologies may support website security, protected reviewer sign-in and, when enabled, form verification. Form answers are held in memory while you use the page. This panel does not set cookies or save a preference in your browser.</p>
      <p>Your browser settings let you block or delete cookies. Blocking necessary cookies may affect sign-in or security features. Form follow-up and marketing permissions are separate from cookie preferences.</p>
      <Link href="/cookie-policy">Read the Cookie Policy</Link>
      <button autoFocus type="button" className={s.close} onClick={close}>Close cookie preferences</button>
    </dialog></>;
}
