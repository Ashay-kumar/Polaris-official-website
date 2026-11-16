"use client";
import Link from "@/components/ui/site-link";
import Image from "next/image";
import { publicPath } from "@/lib/public-path";
import { UserCircleIcon } from "@phosphor-icons/react/dist/ssr/UserCircle";
import { EnvelopeIcon } from "@phosphor-icons/react/dist/ssr/Envelope";
import { PolarisIcon } from "@/components/brand/polaris-icon";
import { useEffect, useRef, useState } from "react";
import { phoneError, normalisePhone, type CountryCode } from "@/lib/phone";
import { feedbackQuestions, type FeedbackQuestionKey } from "@/content/website-copy";
import { perspectives } from "@/content/qualities";
import { formsAvailable, useFormReady, useFormSubmission } from "@/lib/form-submission";
import { adultNotice, retentionNotice } from "@/content/form-compliance";
import consent from "@/content/consent.json";
import { InternationalPhone } from "./international-phone";
import { PrivacyAcknowledgement } from "./privacy-acknowledgement";
import { SubmissionVerification } from "./submission-verification";
import { FeedbackConfirmation } from "./feedback-confirmation";
import s from "./feedback-form.module.css";

type Answers = { perspective: string; earlierLifeSkill: string; challenge: string; wish: string; understand: string; name: string; email: string; phone: string; phoneCountry: CountryCode; followUp: boolean; adult: "" | "yes" | "no"; privacyAcknowledged: boolean };
type Errors = Partial<Record<keyof Answers, string>>;
const initial: Answers = { perspective: "", earlierLifeSkill: "", challenge: "", wish: "", understand: "", name: "", email: "", phone: "", phoneCountry: "IN", followUp: false, adult: "", privacyAcknowledged: false };
export function FeedbackGuidance() { return <details id="preview-info" className={s.preview}><summary><Image src={publicPath("/images/help-shape-polaris/conversation-bubbles.svg")} width={44} height={44} alt="" unoptimized/><span>Share thoughtfully</span></summary><p>{adultNotice}</p><p>Please avoid sensitive or identifying information about a child.</p><p>{retentionNotice} <Link href="/privacy-policy">Privacy Policy</Link></p></details>; }
export function FeedbackForm() {
 const ready = useFormReady();
 const submission = useFormSubmission("feedback");
 const [answers, setAnswers] = useState<Answers>(initial), [errors, setErrors] = useState<Errors>({});
 const form = useRef<HTMLFormElement>(null), success = useRef<HTMLDivElement>(null), failure = useRef<HTMLParagraphElement>(null);
 useEffect(() => { if (submission.receipt) success.current?.focus(); }, [submission.receipt]);
 useEffect(() => { if (submission.error) failure.current?.focus(); }, [submission.error]);
 function update<K extends keyof Answers>(key: K, value: Answers[K]) { setAnswers(old => ({...old, [key]: value})); setErrors(old => ({...old, [key]: undefined, ...(["earlierLifeSkill","challenge","wish","understand"].includes(key) ? {challenge: undefined} : {})})); }
 function send() {
  const next: Errors = {};
  if (!perspectives.some(p => p.id === answers.perspective)) next.perspective = "Choose the perspective you are sharing.";
  if (!feedbackQuestions.map(question => answers[question.key]).some(text => (text.match(/[\p{L}\p{N}]/gu) || []).length >= 10)) next.challenge = "Please share a meaningful response to at least one of the four questions.";
  for (const {key} of feedbackQuestions) if (answers[key].trim().length > 8000) next[key] = "This response is too long to send safely. Please shorten it.";
  if (answers.name.trim().length > 100) next.name = "Please shorten your name to 100 characters or fewer.";
  if (answers.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim())) next.email = "Enter a valid email address.";
  if (answers.followUp && !answers.email.trim()) next.email = "Add an email for follow-up, or leave follow-up permission unchecked.";
  const phone = phoneError(answers.phone, answers.phoneCountry); if (phone) next.phone = phone;
  if (answers.adult !== "yes") next.adult = "You must be 18 or older to submit. A parent or guardian may submit using their own details.";
  if (!answers.privacyAcknowledged) next.privacyAcknowledged = "Acknowledge the Privacy Policy before submitting.";
  setErrors(next);
  if (Object.keys(next).length) { requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('input[aria-invalid="true"], textarea[aria-invalid="true"], input[data-invalid="true"]')?.focus()); return; }
  void submission.submit({category: answers.perspective === "visitor" ? "interested" : answers.perspective, earlierLifeSkill: answers.earlierLifeSkill.trim(), challenges: answers.challenge.trim(), resources: answers.wish.trim(), suggestions: answers.understand.trim(), name: answers.name.trim(), email: answers.email.trim(), phone: normalisePhone(answers.phone, answers.phoneCountry) || "", country: answers.phoneCountry, adultConfirmed: answers.adult === "yes", privacyAcknowledged: answers.privacyAcknowledged, contactConsent: answers.followUp});
 }
 function field(id: FeedbackQuestionKey, label: string, asset: string) {
  return <div className={`${s.field} ${s.questionField}`}><label htmlFor={id}><Image src={publicPath(`/images/help-shape-polaris/${asset}`)} width={48} height={48} alt="" unoptimized/><span className={s.questionLabel}>{label} <span>(optional)</span></span></label><textarea id={id} name={id} rows={4} value={answers[id]} onChange={e => update(id,e.target.value)} aria-invalid={!!errors[id]} aria-describedby={errors[id] ? id+"-error" : undefined}/>{errors[id] && <p id={id+"-error"} className={s.error}>{errors[id]}</p>}</div>;
 }
 return <div className={s.wrapper}>

  {submission.receipt ? <div ref={success} tabIndex={-1}><FeedbackConfirmation receipt={submission.receipt} onAnother={() => { submission.reset(); setAnswers(initial); setErrors({}); requestAnimationFrame(() => form.current?.querySelector<HTMLElement>("input")?.focus()); }}/></div> :
  <form method="post" ref={form} className={s.form} noValidate aria-label="Share your perspective" aria-busy={submission.pending} onSubmit={e => {e.preventDefault();send();}}>
   {Object.values(errors).some(Boolean) && <div role="alert" className={s.errorSummary}>Please check the highlighted fields below.</div>}
   <fieldset className={s.group} disabled={submission.pending}><legend className={s.title}>Your perspective</legend>
    <fieldset className={s.perspectives} aria-invalid={!!errors.perspective}><legend>Which perspective are you sharing today?</legend><div className={s.roleGrid}>{perspectives.map(p => <label key={p.id} className={answers.perspective === p.id ? s.selected : ""}><input type="radio" name="perspective" required value={p.id} checked={answers.perspective === p.id} onChange={() => update("perspective",p.id)} data-invalid={!!errors.perspective} aria-describedby={errors.perspective ? "perspective-error" : undefined}/><Image src={publicPath(`/images/help-shape-polaris/${p.asset}`)} width={64} height={64} alt="" unoptimized/><span>{p.label}</span></label>)}</div>{errors.perspective && <p id="perspective-error" className={s.error}>{errors.perspective}</p>}</fieldset>
    <p>Answer whichever questions are relevant. Please share at least one meaningful response.</p>
    {feedbackQuestions.map(question => <div key={question.key} className={s.questionWrap}>{field(question.key, question.label, question.asset)}</div>)}
   </fieldset>
   <fieldset className={s.group} disabled={submission.pending}><legend className={s.title}>Stay in touch, if you choose.</legend>
    <div className={s.field}><label htmlFor="name"><PolarisIcon icon={UserCircleIcon} size={20}/>Your name <span>(optional)</span></label><input id="name" autoComplete="name" value={answers.name} onChange={e => update("name",e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined}/>{errors.name && <p id="name-error" className={s.error}>{errors.name}</p>}</div>
    <div className={s.field}><label htmlFor="email"><PolarisIcon icon={EnvelopeIcon} size={20}/>Your email <span>(optional unless follow-up is selected)</span></label><input id="email" type="email" autoComplete="email" maxLength={254} value={answers.email} onChange={e => update("email",e.target.value)} aria-invalid={!!errors.email} aria-describedby="email-hint email-error"/><span id="email-hint" className={s.hint}>Providing contact details does not opt you into follow-up.</span><p id="email-error" className={s.error}>{errors.email}</p></div>
    <InternationalPhone id="phone" label="Your phone number" country={answers.phoneCountry} value={answers.phone} onChange={v => update("phone",v)} onCountryChange={v => update("phoneCountry",v)} error={errors.phone}/>
   </fieldset>
   <fieldset className={s.group} disabled={submission.pending}><legend className={s.title}>Before you submit</legend>
    <fieldset className={s.eligibility} aria-invalid={!!errors.adult}><legend>Are you 18 or older?</legend><p id="adult-notice">{adultNotice}</p><div>{(["yes","no"] as const).map(value => <label key={value}><input type="radio" name="adult" required value={value} checked={answers.adult === value} onChange={() => update("adult",value)} data-invalid={!!errors.adult} aria-describedby="adult-notice adult-error"/>{value === "yes" ? "Yes" : "No"}</label>)}</div><p id="adult-error" className={s.error}>{errors.adult || (answers.adult === "no" ? "Only adults aged 18 or older can submit this form." : "")}</p></fieldset>
    <PrivacyAcknowledgement id="privacyAcknowledged" checked={answers.privacyAcknowledged} onChange={v => update("privacyAcknowledged",v)} error={errors.privacyAcknowledged} className={s.consent}/>
    <label className={s.consent}><input type="checkbox" name="followUp" checked={answers.followUp} onChange={e => update("followUp",e.target.checked)}/><span>{consent.feedback.text} <small>Optional.</small></span></label>
   </fieldset>
   <div className={s.unavailable}>{formsAvailable && <SubmissionVerification key={submission.challenge} kind="feedback" onToken={submission.setToken}/>}
    {submission.error && <p ref={failure} tabIndex={-1} role="alert">{submission.error}</p>}
    <p role="status">{submission.pending ? "Saving your perspective..." : ""}</p>
    <button type="submit" className={s.next} disabled={!ready || !formsAvailable || submission.pending}>{submission.pending ? "Submitting..." : submission.error ? "Retry your perspective" : "Submit Your Perspective"}</button>
    {!formsAvailable && <p>Feedback submission is currently unavailable. Your answers have not been sent.</p>}
    {submission.error && <button type="button" className={s.back} onClick={submission.reset}>Start a new submission</button>}
   </div>
  </form>}
 </div>;
}
