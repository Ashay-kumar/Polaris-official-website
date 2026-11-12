import Link from "@/components/ui/site-link";
import { PolarisLogo } from "@/components/brand/polaris-logo";
import s from "@/styles/website.module.css";

export function SiteFooter() {
  return <footer className={s.footer}><div className={`${s.container} ${s.footerGrid}`}>
    <div><Link href="/" aria-label="Kyro Learning home"><PolarisLogo width={156} /></Link><p>A beginning beyond the marks.<br />An early-stage initiative exploring children’s everyday growth.</p></div>
    <nav aria-label="Footer navigation"><Link href="/our-thinking">Our Thinking</Link><Link href="/home-leadership-kit">Home Leadership Kit</Link><Link href="/help-shape-polaris">Help Shape Kyro Learning</Link><Link href="/about">About Kyro Learning</Link></nav>
    <div className={s.footerNote}><p>Different children.<br />Different paths.<br /><strong>Room to grow.</strong></p></div>
  </div><div className={`${s.container} ${s.footerBottom}`}><span>© 2026 Kyro Learning</span><Link href="/help-shape-polaris#preview-info">Feedback information</Link><span>Made for conversations, not comparisons.</span></div></footer>;
}
