"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getConsent, initializeConsent, saveConsent, serverConsent, subscribeConsent, visitPage } from "@/lib/analytics-consent";
import s from "./legal.module.css";

export function AnalyticsController() {
  const pathname = usePathname();
  useEffect(initializeConsent, []);
  useEffect(() => { visitPage(pathname); }, [pathname]);
  return null;
}

export function AnalyticsPreference() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, serverConsent);
  const [feedback, setFeedback] = useState("");
  const enabled = consent === "granted";

  return <div id="analytics-settings" className={s.analyticsPreference}>
    <label>
      <input type="checkbox" checked={enabled} disabled={consent === "loading"} aria-describedby="analytics-status"
        onChange={event => {
          const allow = event.currentTarget.checked;
          const saved = saveConsent(allow ? "granted" : "denied");
          setFeedback(saved ? "" : allow
            ? "Your browser could not save your choice. Analytics remains off."
            : "Analytics is off for this page. If your browser could not clear the saved choice, clear this site’s data before continuing.");
        }} />
      Allow optional website analytics
    </label>
    <div id="analytics-status" role="status">{feedback || (enabled ? "Analytics is on." : "Analytics is off.")}</div>
  </div>;
}
