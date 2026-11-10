import { publicPath } from "@/lib/public-path";
import Image from "next/image";
import Link from "@/components/ui/site-link";
import { qualities } from "@/content/qualities";
import { QualityIcon } from "@/components/brand/quality-icon";
import s from "@/styles/website.module.css";

export function QualityCards({ expandable = false }: { expandable?: boolean }) {
  return <div className={expandable ? s.qualityDetailsGrid : s.qualityGrid}>
    {qualities.map((q, i) => expandable ? <details key={q.id} id={q.id} className={`${s.qualityDetail} ${s[q.id]}`}>
      <summary><QualityIcon quality={q.id} /><span><span className={s.number}>0{i + 1}</span><span className={s.qualityName}>{q.name}</span><span className={s.qualityDescription}>{q.description}</span></span><span className={s.expand} aria-hidden="true">+</span></summary>
      <div className={s.qualityAnswer}><h3>An everyday example</h3><p>{q.example}</p><h3>A question to reflect on</h3><p>{q.reflection}</p><Link href="/home-leadership-kit#activities">Explore the activities <span aria-hidden="true">→</span></Link></div>
    </details> : <Link key={q.id} className={`${s.qualityCard} ${s[q.id]}`} href={`/our-thinking#${q.id}`}>
      <Image src={publicPath(`/images/home/${q.photo}`)} width={q.width} height={q.height} alt="" sizes="(max-width: 600px) 40vw, 280px" />
      <div><QualityIcon quality={q.id} /><h3>{q.name}</h3><p>{q.description}</p><span className={s.cardArrow} aria-hidden="true">↗</span></div>
    </Link>)}
  </div>;
}
