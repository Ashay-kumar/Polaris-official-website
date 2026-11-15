"use client";
import { adultNotice } from "@/content/form-compliance";

export function AdultConfirmation({ id, checked, onChange, error, className }: { id: string; checked: boolean; onChange: (checked: boolean) => void; error?: string; className?: string }) {
  return <div><p id={`${id}-notice`}>{adultNotice}</p><label className={className}><input id={id} name="adultConfirmed" type="checkbox" required checked={checked} onChange={event => onChange(event.target.checked)} aria-invalid={!!error} aria-describedby={`${id}-notice${error ? ` ${id}-error` : ""}`}/><span>I confirm that I am 18 or older.</span></label>{error && <p id={`${id}-error`}>{error}</p>}</div>;
}
