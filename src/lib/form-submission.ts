"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import { privacyPolicyVersion } from "@/content/form-compliance";
import consent from "@/content/consent.json";

const subscribeToHydration = () => () => {};
export function useFormReady() { return useSyncExternalStore(subscribeToHydration, () => true, () => false); }

export type FormKind = "feedback" | "kit";
export type KitAuthorization = { status: "ready"; token: string; expiresAt: string } | { status: "redeemed" };
export type SubmissionReceipt = { status: "accepted"; submissionId: string; persistedAt: string; rowsWritten: 1; download?: KitAuthorization };
export const formConfiguration = {
  enabled: process.env.NEXT_PUBLIC_FORM_SUBMISSIONS_ENABLED === "true",
  baseUrl: process.env.NEXT_PUBLIC_FORMS_API_BASE_URL ?? "",
  siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  notices: {
    privacy: process.env.NEXT_PUBLIC_PRIVACY_NOTICE_VERSION || privacyPolicyVersion,
    feedback: process.env.NEXT_PUBLIC_FEEDBACK_CONSENT_VERSION || consent.feedback.version,
    kit: process.env.NEXT_PUBLIC_KIT_FOLLOWUP_NOTICE_VERSION || consent.kit.version,
    marketing: process.env.NEXT_PUBLIC_MARKETING_CONSENT_VERSION || consent.marketing.version,
  },
};
export const formsAvailable = formConfiguration.enabled && !!formConfiguration.siteKey && formConfiguration.notices.privacy === privacyPolicyVersion && Object.entries(consent).every(([key, value]) => formConfiguration.notices[key as keyof typeof formConfiguration.notices] === value.version);

export async function postSubmission(kind: FormKind, data: Record<string, unknown>, id: string, token: string, signal?: AbortSignal): Promise<SubmissionReceipt> {
  const response = await fetch(formConfiguration.baseUrl.replace(/\/$/, "") + (kind === "kit" ? "/api/kit-request" : "/api/feedback"), {
    method: "POST", credentials: "same-origin", cache: "no-store", signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, submissionId: id, turnstileToken: token, notices: formConfiguration.notices }),
  });
  if (response.status === 401 || response.redirected) throw new Error("The submission service is unavailable. Keep your answers and retry later.");
  if (!response.ok) {
    throw new Error(response.status === 429 ? "Too many requests. Wait a moment, then retry." : response.status === 409 ? "This request needs review. Restore the original answers and retry, or deliberately start a new submission." : response.status === 422 ? "Check your details before retrying." : "Storage could not be confirmed. Your answers are still here. Retry the same submission.");
  }
  let receipt: SubmissionReceipt;
  try { receipt = await response.json(); } catch { throw new Error("Storage could not be confirmed. Retry the same submission."); }
  if (receipt.status !== "accepted" || receipt.submissionId !== id || receipt.rowsWritten !== 1 || !Number.isFinite(Date.parse(receipt.persistedAt))) throw new Error("Storage could not be confirmed. Retry the same submission.");
  if (kind === "kit" && (!receipt.download || (receipt.download.status !== "redeemed" && (receipt.download.status !== "ready" || !/^[A-Za-z0-9_-]{43}$/.test(receipt.download.token) || !Number.isFinite(Date.parse(receipt.download.expiresAt)))))) throw new Error("Download access could not be confirmed. Retry the same request.");
  return receipt;
}

export function useFormSubmission(kind: FormKind) {
  const attempt = useRef<{ id: string; data: string } | null>(null);
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);
  const [token, setToken] = useState("");
  const [challenge, setChallenge] = useState(0);
  async function submit(data: Record<string, unknown>) {
    if (busy.current || receipt || !formsAvailable) return;
    if (!token) { setError("Complete the verification before submitting."); return; }
    const serialized = JSON.stringify(data);
    if (attempt.current && attempt.current.data !== serialized) { setError("Your answers changed after an attempt. Restore them to retry safely, or deliberately start a new submission; the earlier attempt may have been stored."); return; }
    attempt.current ??= { id: crypto.randomUUID(), data: serialized };
    busy.current = true; setPending(true); setError("");
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 20000);
    try { setReceipt(await postSubmission(kind, data, attempt.current.id, token, controller.signal)); }
    catch (failure) { setError(failure instanceof Error && failure.name !== "AbortError" ? failure.message : "Storage could not be confirmed. Your answers are still here. Retry the same submission."); }
    finally { clearTimeout(timeout); busy.current = false; setPending(false); setToken(""); setChallenge(n => n + 1); }
  }
  function reset() { if (busy.current) return; attempt.current = null; setError(""); setReceipt(null); setToken(""); setChallenge(n => n + 1); }
  function renewDownload() { if (busy.current) return; setReceipt(null); setError(""); setToken(""); setChallenge(n => n + 1); }
  return { submit, reset, renewDownload, pending, error, receipt, token, setToken, challenge };
}
