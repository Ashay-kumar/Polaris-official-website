import { publicPath } from "@/lib/public-path";
import Image from "next/image";
import type { ReactNode } from "react";
import { Decoration, Eyebrow, Photo } from "@/components/ui/website";
import { KitDocumentPreview } from "@/components/brand/kit-document-preview";
import { QualityIcon } from "@/components/brand/quality-icon";
import { qualities } from "@/content/qualities";
import s from "./editorial-heroes.module.css";

export function HomeHero({ children }: { children: ReactNode }) {
  return <section className={s.home} aria-labelledby="home-title"><div className={s.container}>
    <div className={s.homeIntro}><Eyebrow>A different way to think about growth</Eyebrow><h1 id="home-title">Beyond<br />the <span>Marks.</span></h1></div>
    <div className={s.homeVisual}><Photo src="home/curious-child-telescope.jpg" width={894} height={308} alt="Illustration of a child exploring the world through a cardboard telescope" priority /><Decoration asset="north-star-lime.svg" /></div>
    <div className={s.homeMessage}>{children}</div>
    <div className={s.homePath} aria-hidden="true" />
    <ul className={s.qualityRail} aria-label="The four qualities">{qualities.map(q=><li key={q.id}><QualityIcon quality={q.id} size={24} /><span>{q.name}</span></li>)}</ul>
  </div></section>;
}

export function ThinkingHero({ children }: { children: ReactNode }) {
  return <section className={s.thinking} data-surface="inverse" aria-labelledby="thinking-title"><div className={s.container}>
    <div className={s.thinkingHeading}><Eyebrow>Our thinking</Eyebrow><h1 id="thinking-title">There’s more to a child than <span>what fits on a report card.</span></h1></div>
    <figure className={s.report}><Image src={publicPath("/images/our-thinking/our-thinking-report-card.svg")} width={560} height={650} alt="Illustrative report card with fictional grades, not a Polaris assessment" priority unoptimized /><figcaption>One part of a much bigger picture.<br /><small>Illustrative report card, not an assessment.</small></figcaption></figure>
    <div className={s.thinkingMessage}>{children}</div>
    <div className={s.thinkingHuman}><Photo src="our-thinking/our-thinking-hero-dreaming-child.jpg" width={526} height={252} alt="Illustration of a child daydreaming" priority /><span aria-hidden="true" className={s.annotation}>Questions. Ideas.<br />Possibilities.</span></div>
  </div></section>;
}

export function KitHero({ children }: { children: ReactNode }) {
  return <section className={s.kit} aria-labelledby="kit-title"><div className={s.container}>
    <div className={s.kitCopy}><Eyebrow>The Home Leadership Kit</Eyebrow><h1 id="kit-title">Little moments.<br /><span>Big possibilities.</span></h1>{children}</div>
    <div className={s.kitScene}><div className={s.familyFrame}><Photo src="home-leadership-kit/provisional-photos/parent-child-learning.jpg" width={362} height={207} alt="Illustration of a parent and child enjoying an activity together" priority /></div><div className={s.pageTwo}><KitDocumentPreview page={2} caption={false} /></div><div className={s.pageOne}><KitDocumentPreview priority /></div></div>
  </div></section>;
}

export function ConversationHero({ children }: { children: ReactNode }) {
  return <section className={s.conversation} aria-labelledby="conversation-title"><div className={s.container}>
    <div className={s.conversationCopy}><Eyebrow>Help Shape Polaris</Eyebrow><h1 id="conversation-title">Your voice<br />can shape<br /><span>what comes next.</span></h1>{children}</div>
    <div className={s.conversationScene}><p className={s.firstBubble}>What feels<br /><strong>difficult?</strong></p><p className={s.secondBubble}>What do you<br /><strong>wish existed?</strong></p><div className={s.welcomeFrame}><Photo src="help-shape-polaris/hero-child-thinking-provisional.jpg" width={342} height={251} alt="Illustration of a child thinking about possibilities" priority /></div><p className={s.thirdBubble}>What should we<br /><strong>understand?</strong></p></div>
    <div className={s.conversationStart}><span aria-hidden="true">01</span>Your perspective is a good place to start.<span aria-hidden="true">↓</span></div>
  </div></section>;
}

export function AboutHero({ children }: { children: ReactNode }) {
  return <section className={s.about} aria-labelledby="about-title"><div className={s.container}>
    <div className={s.aboutLabel}><Eyebrow>About Polaris</Eyebrow><Decoration asset="north-star-lime.svg" /></div>
    <h1 id="about-title">A beginning<br />worth <span>believing in.</span></h1>
    <div className={s.aboutFrames}><div className={s.aboutFrameOne}><Photo src="our-thinking/our-thinking-hero-dreaming-child.jpg" width={526} height={252} alt="Illustrative child portrait, not a Polaris participant" priority /></div><div className={s.aboutFrameTwo}><Photo src="help-shape-polaris/parent-child-learning-provisional.jpg" width={359} height={250} alt="Illustrative family moment, not a customer photograph" priority /></div></div>
    <div className={s.aboutMessage}>{children}</div>
  </div></section>;
}

export function PersonalProgressVisual() {
  return <div className={s.progressVisual}><div className={s.progressFrame}><Photo src="our-thinking/our-thinking-personal-progress.jpg" width={311} height={206} alt="Illustration of a child pausing outdoors" /><p>Their own path.<br /><strong>Their own pace.</strong></p></div><div className={s.progressNote}>Notice effort.<br />Make room to try again.</div><div className={s.progressPath} aria-hidden="true" /></div>;
}

export function ConversationCollage() {
  return <figure className={s.collage}><div className={s.collageFamily}><Photo src="help-shape-polaris/parent-child-learning-provisional.jpg" width={359} height={250} alt="Illustrative parent and child sharing an activity" /></div><div className={s.collageTalk}><Photo src="home-leadership-kit/provisional-photos/activity-teach-me.jpg" width={352} height={208} alt="Illustrative family conversation" /></div><div className={s.collageChild}><Photo src="help-shape-polaris/child-smiling-provisional.jpg" width={285} height={249} alt="Illustrative child portrait" /></div><figcaption>Different perspectives, room to listen.<small>Illustrative images, not Polaris participants.</small></figcaption></figure>;
}
