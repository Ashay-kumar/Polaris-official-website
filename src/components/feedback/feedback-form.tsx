"use client";
import { publicPath } from "@/lib/public-path";


import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { perspectives } from "@/content/qualities";
import s from "./feedback-form.module.css";

type Answers = { perspective: string; challenge: string; wish: string; understand: string; name: string; email: string; followUp: boolean };
type Errors = Partial<Record<keyof Answers, string>>;
const steps = ["Your perspective", "Your experience", "Your ideas", "Stay in touch"];
const initial: Answers = { perspective: "", challenge: "", wish: "", understand: "", name: "", email: "", followUp: false };

export function FeedbackForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [review, setReview] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const focusPending = useRef(false);
  useEffect(() => { if (!focusPending.current) return; focusPending.current = false; heading.current?.focus(); }, [step, review]);

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
      if (answers.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim())) next.email = "Enter an email address in the format name@example.com.";
      if (answers.followUp && !answers.email.trim()) next.email = "Add an email address if you would like follow-up contact, or untick the follow-up option.";
    }
    setErrors(next);
    if (Object.keys(next).length) { requestAnimationFrame(() => errorSummary.current?.focus()); return false; }
    return true;
  }
  function next() { if (validate()) { focusPending.current = true; if (step < 3) setStep(step + 1); else setReview(true); } }
  function field(id: "challenge" | "wish" | "understand", label: string, optional = false) {
    return <div className={s.field}><label htmlFor={id}>{label} {optional && <span>(optional)</span>}</label><textarea id={id} name={id} rows={5} maxLength={2000} required={!optional} minLength={optional ? undefined : 10} value={answers[id]} onChange={event => update(id,event.target.value)} aria-invalid={!!errors[id]} aria-describedby={`${id}-hint${errors[id] ? ` ${id}-error` : ""}`} /><span id={`${id}-hint`} className={s.hint}>{optional ? "Up to" : "10 to"} 2,000 characters. {answers[id].length}/2,000</span>{errors[id] && <p id={`${id}-error`} className={s.error}>{errors[id]}</p>}</div>;
  }
  return <div className={s.wrapper}>
    <aside id="preview-info" className={s.preview}><strong>Local preview — submission is unavailable.</strong><p>You can explore the questions and review your answers. This form does not send responses or save them to browser storage. Answers stay in this page’s memory only; reloading clears them. Please don’t enter sensitive or identifying information about a child.</p></aside>
    <form className={s.form} noValidate onSubmit={event => event.preventDefault()} aria-label="Share your perspective">
      <ol className={s.progress} aria-label="Conversation progress">{steps.map((label,index)=><li key={label} aria-current={step === index ? "step" : undefined} className={step === index ? s.current : ""}><span aria-hidden="true">{index + 1}</span>{label}{index < step && <span className="sr-only">, completed</span>}</li>)}</ol>
      <h3 tabIndex={-1} ref={heading} className={s.title}>{review ? "Review your perspective" : `${step + 1}. ${steps[step]}`}</h3>
      {Object.values(errors).some(Boolean) && <div ref={errorSummary} tabIndex={-1} className={s.errorSummary} role="alert"><strong>A little more information is needed.</strong><ul>{Object.entries(errors).filter(([,value])=>value).map(([key,value])=><li key={key}><a href={`#${key === "perspective" ? "perspective-parent" : key}`}>{value}</a></li>)}</ul></div>}
      {review ? <div className={s.review}><p>Your answers have <strong>not been submitted</strong>.</p><dl><dt>Perspective</dt><dd>{perspectives.find(p=>p.id === answers.perspective)?.label}</dd><dt>A challenge</dt><dd>{answers.challenge}</dd><dt>Support you wish existed</dt><dd>{answers.wish}</dd><dt>Anything else to understand</dt><dd>{answers.understand || "Not provided"}</dd><dt>Name</dt><dd>{answers.name || "Not provided"}</dd><dt>Email</dt><dd>{answers.email || "Not provided"}</dd><dt>Follow-up contact</dt><dd>{answers.followUp ? "Selected in this preview; no contact request has been sent." : "Not selected"}</dd></dl></div> : <>
        {step === 0 && <fieldset className={s.perspectives} aria-describedby={errors.perspective ? "perspective-error" : "perspective-hint"}><legend>Which perspective are you sharing today?</legend><p id="perspective-hint">Choose the one that best fits this conversation.</p><div className={s.roleGrid}>{perspectives.map(p=><label key={p.id} className={answers.perspective === p.id ? s.selected : ""}><input id={`perspective-${p.id}`} type="radio" name="perspective" value={p.id} checked={answers.perspective === p.id} onChange={()=>update("perspective",p.id)} required /><Image src={publicPath(`/images/help-shape-polaris/${p.asset}`)} width={56} height={56} alt="" unoptimized /><span>{p.label}</span></label>)}</div>{errors.perspective && <p id="perspective-error" className={s.error}>{errors.perspective}</p>}</fieldset>}
        {step === 1 && field("challenge", "What’s one challenge you see in supporting children’s growth?")}
        {step === 2 && <>{field("wish", "What resources or support do you wish existed to make that easier?")}{field("understand", "What else should Polaris understand before building further?", true)}</>}
        {step === 3 && <><p>Contact details are optional. You can share a perspective without agreeing to follow-up contact.</p><div className={s.field}><label htmlFor="name">Your name <span>(optional)</span></label><input id="name" name="name" autoComplete="name" maxLength={100} value={answers.name} onChange={event=>update("name",event.target.value)} /></div><div className={s.field}><label htmlFor="email">Your email address <span>(optional unless follow-up is selected)</span></label><input id="email" name="email" type="email" autoComplete="email" maxLength={254} value={answers.email} onChange={event=>update("email",event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : "email-hint"} /><span id="email-hint" className={s.hint}>No email will be sent from this preview.</span>{errors.email && <p id="email-error" className={s.error}>{errors.email}</p>}</div><label className={s.consent}><input type="checkbox" name="followUp" checked={answers.followUp} onChange={event=>update("followUp",event.target.checked)} /><span>You may contact me about this feedback. <small>Optional follow-up choice; draft wording for preview.</small></span></label></>}
      </>}
      <div className={s.controls}>{(step > 0 || review) && <button type="button" className={s.back} onClick={()=>{focusPending.current = true;setErrors({});if(review)setReview(false);else setStep(step-1);}}>← {review ? "Edit contact details" : "Back"}</button>}{!review && <button type="button" className={s.next} onClick={next}>{step === 3 ? "Review my answers" : "Next"} <span aria-hidden="true">→</span></button>}</div>
      {review && <div className={s.unavailable}><button type="submit" disabled aria-describedby="preview-info">Submission unavailable in preview</button><p>Nothing has been received by Polaris. A privacy notice and secure submission service must be approved before this action can be enabled.</p><button type="button" className={s.back} onClick={()=>{focusPending.current = true;setReview(false);setStep(0);setErrors({});}}>Edit my perspective</button></div>}
    </form>
  </div>;
}
