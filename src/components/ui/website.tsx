import { KitDownloadTrigger } from "@/components/feedback/kit-access";
import { publicPath } from "@/lib/public-path";
import Image from "next/image";
import Link from "@/components/ui/site-link";
import type { ReactNode } from "react";
import { kitDownload } from "@/content/qualities";
import { KitIllustration } from "@/components/brand/kit-illustration";
import s from "@/styles/website.module.css";

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "lime" | "light"; download?: boolean }) {
  const props = { className: `${s.button} ${s[variant]}`, children };
  return href.startsWith(kitDownload) ? <KitDownloadTrigger {...props} /> : <Link href={href} {...props} />;
}
export function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`${s.section} ${className}`}><div className={s.container}>{children}</div></section>;
}
export function Eyebrow({ children }: { children: ReactNode }) { return <p className={s.eyebrow}>{children}</p>; }
export function Heading({ children, level = 2 }: { children: ReactNode; level?: 1 | 2 | 3 }) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  return <Tag className={level === 1 ? s.display : level === 3 ? s.cardHeading : s.heading}>{children}</Tag>;
}
export function Accent({ children, pink = false }: { children: ReactNode; pink?: boolean }) { return <span className={pink ? s.pinkText : s.highlight}>{children}</span>; }
export function Decoration({ asset = "accent-rays-pink.svg", className = "" }: { asset?: string; className?: string }) {
  return <Image className={`${s.decoration} ${className}`} src={publicPath(`/images/home/${asset}`)} alt="" width={180} height={160} unoptimized />;
}
export function Photo({ src, width, height, alt, priority = false, className = "" }: { src: string; width: number; height: number; alt: string; priority?: boolean; className?: string }) {
  return <div className={`${s.photo} ${className}`} style={{ maxWidth: width }}><Image src={publicPath(`/images/${src}`)} width={width} height={height} alt={alt} priority={priority} sizes={`(max-width: 600px) 100vw, ${Math.min(width, 600)}px`} style={{ maxWidth: width }} /></div>;
}
export function Hero({ eyebrow, title, children, art, home = false, light = false }: { eyebrow: string; title: ReactNode; children: ReactNode; art: ReactNode; home?: boolean; light?: boolean }) {
  return <section className={`${s.hero} ${home ? s.homeHero : ""} ${light ? s.heroLight : s.heroBlue}`} data-surface={light ? undefined : "inverse"}>
    <div className={`${s.container} ${s.heroGrid}`}><div className={s.heroCopy}><Eyebrow>{eyebrow}</Eyebrow><Heading level={1}>{title}</Heading>{children}</div>
      <div className={s.heroArt}>{art}<Decoration asset="north-star-lime.svg" className={s.heroStar} /><Decoration className={s.heroRays} /></div>
    </div><div className={s.wave} aria-hidden="true" />
  </section>;
}
export function KitCover() { return <div className={s.kitCover}><KitIllustration /></div>; }
export function KitFeature({ download = false }: { download?: boolean }) {
  return <Section className={s.kitFeature}><div className={s.split}><KitCover /><div><Eyebrow>A practical start</Eyebrow><Heading>The Home<br />Leadership <Accent pink>Kit.</Accent></Heading><p className={s.lead}>12 simple, at-home activities to build communication, leadership, curiosity and resilience in children aged 5 to 14.</p><ButtonLink href={download ? kitDownload : "/home-leadership-kit"} download={download}>{download ? "Download the Kit" : "Explore the Kit"}</ButtonLink><p className={s.caption}>A reflection and activity guide. Not a clinical or psychological assessment.</p></div></div></Section>;
}
export function Invite({ title = <>Your perspective<br />matters.</>, children, label = "Help Shape Kyro Learning" }: { title?: ReactNode; children?: ReactNode; label?: string }) {
  return <section className={s.invite} data-surface="inverse"><div className={`${s.container} ${s.inviteGrid}`}><Heading>{title}</Heading><p>{children ?? "Kyro Learning is taking shape. Share your thoughts, experiences and what you would like us to explore next."}</p><ButtonLink href="/help-shape-polaris#conversation" variant="lime">{label}</ButtonLink></div><div className={s.inviteRibbon} aria-hidden="true" /></section>;
}
