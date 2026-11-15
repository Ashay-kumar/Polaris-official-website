"use client";
import Link from "@/components/ui/site-link";
import { publicPath } from "@/lib/public-path";


import { phoneError, normalisePhone, type CountryCode } from "@/lib/phone";
import { InternationalPhone } from "./international-phone";
import { UserCircleIcon } from "@phosphor-icons/react/dist/ssr/UserCircle";
import { EnvelopeIcon } from "@phosphor-icons/react/dist/ssr/Envelope";
import { LightbulbIcon } from "@phosphor-icons/react/dist/ssr/Lightbulb";
import { PolarisIcon } from "@/components/brand/polaris-icon";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { perspectives } from "@/content/qualities";
import s from "./feedback-form.module.css";
import { formsAvailable, useFormSubmission } from "@/lib/form-submission";
import { SubmissionVerification } from "./submission-verification";
import { FeedbackConfirmation } from "./feedback-confirmation";

import { AdultConfirmation } from "./adult-confirmation";
import { adultNotice, retentionNotice } from "@/content/form-compliance";

import { PrivacyAcknowledgement } from "./privacy-acknowledgement";
import consent from "@/content/consent.json";

type Answers = { perspective: string; challenge: string; wish: string; understand: string; name: string; email: string; phone: string; phoneCountry: CountryCode; followUp: boolean; adultConfirmed: boolean; privacyAcknowledged: boolean };
type Errors = Partial<Record<keyof Answers, string>>;
const steps = ["Your perspective", "Your experience", "Your ideas", "Stay in touch"];
const initial: Answers = { perspective: "", challenge: "", wish: "", understand: "", name: "", email: "", phone: "", phoneCountry: "IN", followUp: false, adultConfirmed: false, privacyAcknowledged: false };

export function FeedbackForm() {
  const submission = useFormSubmission("feedback");
  const success = useRef<HTMLDivElement>(null);
  const submissionError = useRef<HTMLParagraphElement>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [review, setReview] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const focusPending = useRef(false);
  useEffect(() => { if (!focusPending.current) return; focusPending.current = false; heading.current?.focus(); }, [step, review]);
  useEffect(() => { if (submission.receipt) success.current?.focus(); }, [submission.receipt]);
  useEffect(() => { if (submission.error) submissionError.current?.focus(); }, [submission.error]);

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: undefined }));
  }
  function validate() {
    const next: Errors = {};
    if (step === 0 && !perspectives.some(p => p.id === answers.perspective)) next.perspective = "Choose the perspective you are sharing.";
    if (step === 1 && answers.challenge.trim().length < 10) next.challenge = "Please share at least 10 characters about a challenge.";
    if (step === 2 && answers.wish.trim().length < 10) next.wish = "Please share at least 10 characters about support you wish existed.";
    if (step === 3) {
      if (answers.privacyAcknowledged !== true) next.privacyAcknowledged = "Acknowledge the Privacy Policy before submitting.";
      if (answers.adultConfirmed !== true) next.adultConfirmed = "Confirm that you are 18 or older before submitting.";
      const phone = phoneError(answers.phone,answers.phoneCountry); if (phone) next.phone = phone;
      if (answers.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim())) next.email = "Enter an email address in the format name@example.com.";
      if (answers.followUp && !answers.email.trim()) next.email = "Add an email address if you would like follow-up contact, or untick the follow-up option.";
    }
    setErrors(next);
    if (Object.keys(next).length) { requestAnimationFrame(() => errorSummary.current?.focus()); return false; }
    return true;
  }
  function next() { if (validate()) { focusPending.current = true; if (step < 3) setStep(step + 1); else setReview(true); } }
  function send() { if (!review || !validate()) return; void submission.submit({ category: answers.perspective === "visitor" ? "interested" : answers.perspective, challenges: answers.challenge.trim(), resources: answers.wish.trim(), suggestions: answers.understand.trim(), name: answers.name.trim(), email: answers.email.trim(), phone: normalisePhone(answers.phone, answers.phoneCountry) || "", country: answers.phoneCountry, adultConfirmed: answers.adultConfirmed, privacyAcknowledged: answers.privacyAcknowledged, contactConsent: answers.followUp }); }
  function field(id: "challenge" | "wish" | "understand", label: string, optional = false) {
    return <div className={s.field}><label htmlFor={id}>{id === "wish" && <PolarisIcon icon={LightbulbIcon} size={20}/>} {label} {optional && <span>(optional)</span>}</label><textarea id={id} name={id} rows={5} maxLength={2000} required={!optional} minLength={optional ? undefined : 10} value={answers[id]} onChange={event => update(id,event.target.value)} aria-invalid={!!errors[id]} aria-describedby={`${id}-hint${errors[id] ? ` ${id}-error` : ""}`} /><span id={`${id}-hint`} className={s.hint}>{optional ? "Up to" : "10 to"} 2,000 characters. {answers[id].length}/2,000</span>{errors[id] && <p id={`${id}-error`} className={s.error}>{errors[id]}</p>}</div>;
  }
  return <div className={s.wrapper}>
    <aside id="preview-info" className={s.preview}><strong>Share thoughtfully.</strong><p>{adultNotice}</p><p>Please avoid sensitive or identifying information about a child. {!formsAvailable && "Feedback submission is currently unavailable."}</p><p>{retentionNotice} <Link href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy<span className="sr-only"> (opens in a new tab)</span></Link></p></aside>
    {submission.receipt ? <div ref={success} tabIndex={-1}><FeedbackConfirmation receipt={submission.receipt} /><button type="button" className={s.next} onClick={() => { submission.reset(); setAnswers(initial); setReview(false); setStep(0); focusPending.current = true; }}>Share another perspective</button></div> : <form className={s.form} noValidate aria-busy={submission.pending} onSubmit={event => { event.preventDefault(); send(); }} aria-label="Share your perspective">
      <ol className={s.progress} aria-label="Conversation progress">{steps.map((label,index)=><li key={label} aria-current={step === index ? "step" : undefined} className={step === index ? s.current : ""}><span aria-hidden="true">{index + 1}</span>{label}{index < step && <span className="sr-only">, completed</span>}</li>)}</ol>
      <h3 tabIndex={-1} ref={heading} className={s.title}>{review ? "Review your perspective" : `${step + 1}. ${steps[step]}`}</h3>
      {Object.values(errors).some(Boolean) && <div ref={errorSummary} tabIndex={-1} className={s.errorSummary} role="alert"><strong>A little more information is needed.</strong><ul>{Object.entries(errors).filter(([,value])=>value).map(([key,value])=><li key={key}><a href={`#${key === "perspective" ? "perspective-parent" : key}`}>{value}</a></li>)}</ul></div>}
      {review ? <div className={s.review}><p>{submission.pending ? "Submitting your perspective?" : submission.error ? "Storage has not been confirmed. Keep these answers to retry." : "Review your answers. Nothing has been sent."}</p><dl><dt>Perspective</dt><dd>{perspectives.find(p=>p.id === answers.perspective)?.label}</dd><dt>A challenge</dt><dd>{answers.challenge}</dd><dt>Support you wish existed</dt><dd>{answers.wish}</dd><dt>Anything else to understand</dt><dd>{answers.understand || "Not provided"}</dd><dt>Name</dt><dd>{answers.name || "Not provided"}</dd><dt>Email</dt><dd>{answers.email || "Not provided"}</dd><dt>Phone</dt><dd>{normalisePhone(answers.phone,answers.phoneCountry) || "Not provided"}</dd><dt>Adult confirmation</dt><dd>{answers.adultConfirmed ? "18 or older: confirmed" : "Not confirmed"}</dd><dt>Privacy acknowledgement</dt><dd>{answers.privacyAcknowledged ? "Acknowledged" : "Not acknowledged"}</dd><dt>Follow-up contact</dt><dd>{answers.followUp ? "Agreed to feedback follow-up." : "Not selected"}</dd></dl></div> : <>
        {step === 0 && <fieldset className={s.perspectives} aria-describedby={errors.perspective ? "perspective-error" : "perspective-hint"}><legend>Which perspective are you sharing today?</legend><p id="perspective-hint">Choose the one that best fits this conversation.</p><div className={s.roleGrid}>{perspectives.map(p=><label key={p.id} className={answers.perspective === p.id ? s.selected : ""}><input id={`perspective-${p.id}`} type="radio" name="perspective" value={p.id} checked={answers.perspective === p.id} onChange={()=>update("perspective",p.id)} required /><Image src={publicPath(`/images/help-shape-polaris/${p.asset}`)} width={56} height={56} alt="" unoptimized /><span>{p.label}</span></label>)}</div>{errors.perspective && <p id="perspective-error" className={s.error}>{errors.perspective}</p>}</fieldset>}
        {step === 1 && field("challenge", "What’s one challenge you see in supporting children’s growth?")}
        {step === 2 && <>{field("wish", "What resources or support do you wish existed to make that easier?")}{field("understand", "What else should Kyro Learning understand before building further?", true)}</>}
        {step === 3 && <><AdultConfirmation id="adultConfirmed" checked={answers.adultConfirmed} onChange={value => update("adultConfirmed", value)} error={errors.adultConfirmed} className={s.consent}/><PrivacyAcknowledgement id="privacyAcknowledged" checked={answers.privacyAcknowledged} onChange={value => update("privacyAcknowledged",value)} error={errors.privacyAcknowledged} className={s.consent}/><p>Contact details are optional. You can share a perspective without agreeing to follow-up contact.</p><div className={s.field}><label htmlFor="name"><PolarisIcon icon={UserCircleIcon} size={20}/> Your name <span>(optional)</span></label><input id="name" name="name" autoComplete="name" maxLength={100} value={answers.name} onChange={event=>update("name",event.target.value)} /></div><div className={s.field}><label htmlFor="email"><PolarisIcon icon={EnvelopeIcon} size={20}/> Your email address <span>(optional unless follow-up is selected)</span></label><input id="email" name="email" type="email" autoComplete="email" maxLength={254} value={answers.email} onChange={event=>update("email",event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : "email-hint"} /><span id="email-hint" className={s.hint}>Providing an email does not opt you into follow-up.</span>{errors.email && <p id="email-error" className={s.error}>{errors.email}</p>}</div><InternationalPhone id="phone" label="Your phone number" country={answers.phoneCountry} value={answers.phone} onChange={v=>update("phone",v)} onCountryChange={v=>update("phoneCountry",v)} error={errors.phone}/><label className={s.consent}><input type="checkbox" name="followUp" checked={answers.followUp} onChange={event=>update("followUp",event.target.checked)} /><span>{consent.feedback.text}</span></label></>}
      </>}
      <div className={s.controls}>{(step > 0 || review) && <button type="button" disabled={submission.pending} className={s.back} onClick={()=>{focusPending.current = true;setErrors({});if(review)setReview(false);else setStep(step-1);}}>← {review ? "Edit contact details" : "Back"}</button>}{!review && <button type="button" className={s.next} onClick={next}>{step === 3 ? "Review my answers" : "Next"} <span aria-hidden="true">→</span></button>}</div>
      {review && <div className={s.unavailable}>
        {formsAvailable && <SubmissionVerification key={submission.challenge} kind="feedback" onToken={submission.setToken} />}
        {submission.error && <p ref={submissionError} tabIndex={-1} role="alert">{submission.error}</p>}
        <p role="status">{submission.pending ? "Saving your perspective…" : ""}</p>
        <button type="submit" className={s.next} disabled={!formsAvailable || submission.pending || !submission.token} aria-describedby="preview-info">{submission.pending ? "Submitting…" : submission.error ? "Retry submission" : "Submit feedback"}</button>
        {!formsAvailable && <p>Feedback submission is currently unavailable. Your answers have not been sent.</p>}
        {submission.error && <button type="button" className={s.back} onClick={submission.reset}>Start a new submission</button>}
        <button type="button" disabled={submission.pending} className={s.back} onClick={()=>{focusPending.current = true;setReview(false);setStep(0);setErrors({});}}>Edit my perspective</button>
      </div>}
    </form>}
  </div>;
}
