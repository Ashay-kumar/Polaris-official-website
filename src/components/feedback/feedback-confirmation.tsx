import Link from "@/components/ui/site-link";
import s from "./feedback-form.module.css";

/** Future server-acknowledged state. The local preview never creates this receipt. */
export type AcceptedFeedbackReceipt = { status: "accepted"; submissionId: string; persistedAt: string };
export function FeedbackConfirmation({ receipt }: { receipt: AcceptedFeedbackReceipt }) {
  if (receipt.status !== "accepted" || !receipt.submissionId || !Number.isFinite(Date.parse(receipt.persistedAt))) return null;
  return <section className={s.confirmation} role="status" aria-live="polite"><h2>Thank you!</h2><p>Your perspective has been received.</p><Link href="/our-thinking">Explore Our Thinking →</Link><Link href="/home-leadership-kit">Try the Home Leadership Kit →</Link></section>;
}
