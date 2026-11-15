"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { phoneError, normalisePhone, type CountryCode } from "@/lib/phone";
import { InternationalPhone } from "./international-phone";
import s from "./kit-access.module.css";
import { formsAvailable, useFormSubmission } from "@/lib/form-submission";
import { SubmissionVerification } from "./submission-verification";
import { ProtectedKitDownload } from "./protected-kit-download";
import Link from "@/components/ui/site-link";
import { AdultConfirmation } from "./adult-confirmation";
import { retentionNotice } from "@/content/form-compliance";
import { PrivacyAcknowledgement } from "./privacy-acknowledgement";
import consent from "@/content/consent.json";
const Access = createContext<(() => void) | null>(null);
export function KitDownloadTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const open = useContext(Access);
  return <button type="button" className={className} onClick={() => open?.()} aria-haspopup="dialog">{children}</button>;
}
export function KitAccessProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <Access.Provider value={() => setOpen(true)}>{children}<KitAccessDialog open={open} close={() => setOpen(false)} /></Access.Provider>;
}
function KitAccessDialog({ open, close }: { open: boolean; close: () => void }) {
 const submission=useFormSubmission("kit");const success=useRef<HTMLHeadingElement>(null);
 const submissionError=useRef<HTMLParagraphElement>(null);
 const dialog=useRef<HTMLDialogElement>(null),first=useRef<HTMLInputElement>(null),summary=useRef<HTMLDivElement>(null);
 const [values,setValues]=useState({name:"",email:"",phone:"",phoneCountry:"IN" as CountryCode,marketingOptIn:false,adultConfirmed:false,privacyAcknowledged:false});
 const [errors,setErrors]=useState<Record<string,string>>({});const [checked,setChecked]=useState(false);
 useEffect(()=>{if(!open)return;const opener=document.activeElement as HTMLElement|null;const scroll=document.body.style.overflow;const element=dialog.current;element?.showModal();document.body.style.overflow="hidden";if(submission.receipt)success.current?.focus();else first.current?.focus();return()=>{element?.close();document.body.style.overflow=scroll;opener?.focus({preventScroll:true});};},[open,submission.receipt]);
 useEffect(()=>{if(submission.receipt)success.current?.focus();},[submission.receipt]);
 useEffect(()=>{if(submission.error)submissionError.current?.focus();},[submission.error]);
 function update<K extends keyof typeof values>(key:K,value:typeof values[K]){setValues(old=>({...old,[key]:value}));setErrors(old=>({...old,[key]:""}));setChecked(false);}
 function validate(){const next:Record<string,string>={};const name=values.name.trim().replace(/\s+/g," ");
  if(name.length<2||name.length>100)next.name="Enter your full name (2 to 100 characters).";
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))next.email="Enter a valid email address, such as name@example.com.";
  if(values.privacyAcknowledged!==true)next.privacyAcknowledged="Acknowledge the Privacy Policy before submitting.";
  if(values.adultConfirmed!==true)next.adultConfirmed="Confirm that you are 18 or older before submitting.";
  const phone=phoneError(values.phone,values.phoneCountry,true);if(phone)next.phone=phone;
  setErrors(next);setChecked(!Object.keys(next).length);if(Object.keys(next).length)requestAnimationFrame(()=>summary.current?.focus());else setValues(old=>({...old,name,email:old.email.trim()}));
 }
 function send(){if(!checked||values.adultConfirmed!==true||values.privacyAcknowledged!==true)return;void submission.submit({name:values.name,email:values.email.trim(),phone:normalisePhone(values.phone,values.phoneCountry),country:values.phoneCountry,adultConfirmed:values.adultConfirmed,privacyAcknowledged:values.privacyAcknowledged,marketingConsent:values.marketingOptIn});}
 return <dialog ref={dialog} className={s.dialog} aria-labelledby="kit-dialog-title" aria-describedby={submission.receipt?"kit-dialog-purpose":"kit-dialog-purpose kit-availability"} onCancel={event=>{event.preventDefault();close();}} onKeyDown={event=>{
  if(event.key!=="Tab")return;const controls=Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]):not([tabindex="-1"]), input, a[href], [tabindex="0"]')??[]);const first=controls[0],last=controls[controls.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }}><div className={s.top}><span className={s.eyebrow}>The Home Leadership Kit</span><button type="button" onClick={close} className={s.close}>Close<span className="sr-only"> kit dialog</span></button></div>
 <h2 id="kit-dialog-title">Your Kit Is Almost Yours!</h2>
 <p id="kit-dialog-purpose">Share your details to get the free Home Leadership Kit. We&apos;d also love to hear how the activities worked for your family.</p>
 {submission.receipt ? <div><h3 ref={success} tabIndex={-1}>Your kit is ready.</h3><p role="status">Your request has been saved. You can download the Home Leadership Kit now.</p><ProtectedKitDownload authorization={submission.receipt.download!} renew={submission.renewDownload}/><button type="button" className={s.check} onClick={()=>{submission.reset();setChecked(false);setErrors({});setValues({name:"",email:"",phone:"",phoneCountry:"IN",marketingOptIn:false,adultConfirmed:false,privacyAcknowledged:false});requestAnimationFrame(()=>first.current?.focus());}}>Start another kit request</button></div> : <form noValidate aria-busy={submission.pending} onSubmit={event=>{event.preventDefault();validate();}}>
 {Object.values(errors).some(Boolean)&&<div ref={summary} tabIndex={-1} role="alert" className={s.errors}><strong>Please check your details.</strong><ul>{Object.entries(errors).filter(([,v])=>v).map(([key,error])=><li key={key}><a href={"#kit-"+key}>{error}</a></li>)}</ul></div>}
 <fieldset disabled={submission.pending} style={{border:0,padding:0,margin:0,minWidth:0}}>
 <legend className="sr-only">Kit request details</legend>
 <div className={s.field}><label htmlFor="kit-name">Full name</label><input ref={first} id="kit-name" name="fullName" autoComplete="name" required maxLength={100} value={values.name} onChange={e=>update("name",e.target.value)} onBlur={()=>setValues(old=>({...old,name:old.name.trim()}))} aria-invalid={!!errors.name} aria-describedby={errors.name?"kit-name-error":undefined}/>{errors.name&&<p id="kit-name-error" className={s.error}>{errors.name}</p>}</div>
 <div className={s.field}><label htmlFor="kit-email">Email address</label><input id="kit-email" name="email" type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={e=>update("email",e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email?"kit-email-error":undefined}/>{errors.email&&<p id="kit-email-error" className={s.error}>{errors.email}</p>}</div>
 <InternationalPhone id="kit-phone" label="Phone number" required country={values.phoneCountry} value={values.phone} onChange={v=>update("phone",v)} onCountryChange={v=>update("phoneCountry",v)} error={errors.phone}/>
 <AdultConfirmation id="kit-adultConfirmed" checked={values.adultConfirmed} onChange={value=>update("adultConfirmed",value)} error={errors.adultConfirmed} className={s.consent}/>
 <PrivacyAcknowledgement id="kit-privacyAcknowledged" checked={values.privacyAcknowledged} onChange={value=>update("privacyAcknowledged",value)} error={errors.privacyAcknowledged} className={s.consent}/>
 <aside className={s.followup}><strong>We&apos;d love to hear how it goes!</strong><p>{consent.kit.text}</p></aside>
 <label className={s.consent}><input type="checkbox" name="marketingOptIn" checked={values.marketingOptIn} onChange={e=>update("marketingOptIn",e.target.checked)}/><span>{consent.marketing.text}<small>Optional.</small></span></label>
 <button className={s.check} type="submit">Review details</button>
 {checked&&<div role="status" className={s.details}><strong>Review your details</strong><dl><dt>Name</dt><dd>{values.name}</dd><dt>Email</dt><dd>{values.email}</dd><dt>Phone</dt><dd>{normalisePhone(values.phone,values.phoneCountry)}</dd><dt>Adult confirmation</dt><dd>{values.adultConfirmed?"18 or older: confirmed":"Not confirmed"}</dd><dt>Privacy acknowledgement</dt><dd>{values.privacyAcknowledged?"Acknowledged":"Not acknowledged"}</dd><dt>Marketing updates</dt><dd>{values.marketingOptIn?"Selected":"Not selected"}</dd></dl></div>}
 </fieldset>
 <p className={s.privacy}>{retentionNotice} <Link href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy<span className="sr-only"> (opens in a new tab)</span></Link></p>
 {formsAvailable&&open&&<SubmissionVerification key={submission.challenge} kind="kit" onToken={submission.setToken}/>}
 {submission.error&&<p ref={submissionError} tabIndex={-1} role="alert">{submission.error}</p>}
 <p role="status">{submission.pending?"Saving your kit request…":""}</p>
 <button className={formsAvailable?s.check:s.locked} type="button" onClick={send} disabled={!formsAvailable||!checked||submission.pending||!submission.token} aria-describedby="kit-availability">{submission.pending?"Submitting…":submission.error?"Retry request":"Download the Kit"}</button><p id="kit-availability" className={s.privacy}>{!formsAvailable?"Kit requests are currently unavailable. Your details have not been sent.":"Your request must be saved before you receive time-limited download access."}</p>
 {submission.error&&<button className={s.check} type="button" onClick={submission.reset}>Start a new submission</button>}
 </form>}</dialog>;
}
