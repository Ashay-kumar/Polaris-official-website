import Link from "@/components/ui/site-link";
import s from "./feedback-form.module.css";
export type AcceptedFeedbackReceipt = { status: "accepted"; submissionId: string; persistedAt: string };
export function FeedbackConfirmation({ receipt, onAnother }: { receipt: AcceptedFeedbackReceipt; onAnother: () => void }) {
 if (receipt.status !== "accepted" || !receipt.submissionId || !Number.isFinite(Date.parse(receipt.persistedAt))) return null;
 return <section className={s.confirmation} role="status"><span className={s.successLabel}>A perspective worth hearing</span><h2>Thank you for sharing.</h2><p>Your perspective has been saved. Your experiences and ideas help shape what comes next for Kyro Learning.</p><div className={s.successActions}><Link className={s.next} href="/our-thinking">Explore Our Thinking</Link><button className={s.back} type="button" onClick={onAnother}>Share another perspective</button></div></section>;
}
