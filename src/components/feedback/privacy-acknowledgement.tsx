"use client";
import Link from "@/components/ui/site-link";
import consent from "@/content/consent.json";

export function PrivacyAcknowledgement({ id, checked, onChange, error, className }: { id: string; checked: boolean; onChange: (checked: boolean) => void; error?: string; className?: string }) {
  const [before, after] = consent.privacy.acknowledgement.split("Privacy Policy");
  return <div><label className={className}><input id={id} name="privacyAcknowledged" type="checkbox" required checked={checked} onChange={event => onChange(event.target.checked)} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}/><span>{before}<Link href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy<span className="sr-only"> (opens in a new tab)</span></Link>{after}</span></label>{error && <p id={`${id}-error`}>{error}</p>}</div>;
}
