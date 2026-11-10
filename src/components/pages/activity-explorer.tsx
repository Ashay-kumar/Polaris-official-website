"use client";
import { publicPath } from "@/lib/public-path";


import Image from "next/image";
import { useRef, useState } from "react";
import activities from "@/content/activities.json";
import { qualities, type QualityId } from "@/content/qualities";
import { QualityIcon } from "@/components/brand/quality-icon";
import s from "./activity-explorer.module.css";
import w from "@/styles/website.module.css";

const photos: Record<number, { file: string; width: number; height: number }> = {
  1: { file: "activity-communication.jpg", width: 351, height: 208 },
  2: { file: "activity-teach-me.jpg", width: 352, height: 208 },
  3: { file: "activity-writing.jpg", width: 357, height: 208 },
};
export function ActivityExplorer() {
  const [selected, setSelected] = useState<QualityId>("communication");
  const grid = useRef<HTMLDivElement>(null);
  return <div>
    <fieldset className={s.filters}><legend className="sr-only">Choose an activity quality</legend>{qualities.map(q => <label key={q.id} className={selected === q.id ? s.selected : ""}><input type="radio" name="quality" value={q.id} checked={selected === q.id} onChange={() => { setSelected(q.id); grid.current?.scrollTo({ left: 0 }); }} /><QualityIcon quality={q.id} size={20} /><span>{q.name} (3)</span></label>)}</fieldset>
    <p className={s.count} role="status">3 {selected} activities. Open an activity for the full instructions and age guidance.</p>
    <div ref={grid} className={s.activities}>{activities.filter(a => a.quality === selected).map(a => <article key={a.id} className={`${s.card} ${w[selected]}`}>
      {photos[a.id] ? <Image className={s.photo} src={publicPath(`/images/home-leadership-kit/provisional-photos/${photos[a.id].file}`)} width={photos[a.id].width} height={photos[a.id].height} alt="" sizes="(max-width: 600px) 100vw, 320px" /> : <div className={s.icon}><QualityIcon quality={selected} /><span aria-hidden="true">{String(a.id).padStart(2,"0")}</span></div>}
      <div className={s.body}><p className={s.duration}>{a.duration}</p><h3>{a.name}</h3><details><summary>Explore this activity <span aria-hidden="true">+</span></summary><div className={s.instructions}><h4>How</h4><p>{a.instructions}</p><h4>Why it helps</h4><p>{a.rationale}</p><h4>Age guidance</h4><p>{a.ages}</p></div></details></div>
    </article>)}</div>
    <p className={w.caption}>All activity instructions and age guidance are from the original six-page kit. Read them in context in the PDF.</p>
  </div>;
}
