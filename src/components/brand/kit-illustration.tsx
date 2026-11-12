import { PolarisLogo } from "./polaris-logo";
import { QualityIcon } from "./quality-icon";
import activities from "@/content/activities.json";
import s from "./kit-illustration.module.css";
/** Editorial packaging illustration; never presented as a facsimile of the PDF cover. */
export function KitIllustration() {
  return <figure className={s.figure}><div className={s.scene}>
    <div className={s.activity} aria-hidden="true"><QualityIcon quality="communication" size={24}/><strong>Communication</strong><span>{activities.find(a=>a.quality==="communication")?.name}</span><i/><i/></div>
    <div className={s.tracker} aria-hidden="true"><span>Four-week tracker</span><div>{[1,2,3,4].map(week=><b key={week}>{week}</b>)}</div></div>
    <div className={s.book}><div className={s.spine}/><PolarisLogo width={125}/><p className={s.label}>A family activity resource</p><div className={s.title}>Home<br/>Leadership<br/><em>Kit.</em></div><div className={s.path} aria-hidden="true"/><div className={s.qualities}>{(["communication","leadership","curiosity","resilience"] as const).map(q=><span key={q}><QualityIcon quality={q} size={16}/>{q[0].toUpperCase()+q.slice(1)}</span>)}</div><p className={s.details}>12 activities &middot; Ages 5&ndash;14</p></div>
    </div><figcaption>Illustrated kit presentation<span>The original six-page PDF is unchanged.</span></figcaption></figure>;
}
