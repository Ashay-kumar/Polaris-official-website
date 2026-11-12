import type { Metadata } from "next";
import { HomeHero } from "@/components/pages/editorial-heroes";
import { Accent, ButtonLink, Eyebrow, Heading, Invite, KitFeature, Section } from "@/components/ui/website";
import { QualityCards } from "@/components/pages/quality-cards";
import s from "@/styles/website.module.css";

export const metadata: Metadata = { title: "Kyro Learning — Beyond the Marks", description: "An early-stage initiative exploring children's everyday growth beyond academic marks. Explore our thinking, try the Home Leadership Kit and help shape what comes next." };

export default function FoundationPage() {
  return <>
    <HomeHero>
      <p>Every child has their own path. Kyro Learning explores the skills, habits and everyday experiences that matter beyond academic scores.</p>
      <div className={s.actions}><ButtonLink href="/help-shape-polaris#conversation">Share Your Perspective</ButtonLink><ButtonLink href="/our-thinking" variant="secondary">Explore Our Thinking</ButtonLink></div>
    </HomeHero>
    <Section><div className={s.editorialRow}><div><Eyebrow>Our manifesto</Eyebrow><Heading>A more complete<br />picture of <Accent pink>growth.</Accent></Heading></div><div><p className={s.lead}><strong>Children are more than their academic marks.</strong></p><p>Academic learning matters. So do the ways children communicate, take initiative, ask questions and keep going when things are difficult. There is room to notice the whole child.</p><p className={s.manifestoQuote}>Not just higher marks.<br />A fuller picture of growing up.</p></div></div></Section>
    <Section id="four-qualities"><Eyebrow>The four qualities</Eyebrow><Heading>Everyday habits.<br /><Accent>Room to grow.</Accent></Heading><QualityCards /></Section>
    <Section><div className={s.editorialRow}><Heading>The unfolding<br /><Accent pink>path.</Accent></Heading><p className={s.lead}>Growth is a journey, not a single destination. Learning, trying, reflecting and beginning again can look different for every child.</p></div><div className={s.journey}><ol className={s.journeySteps}>{[
      ["Explore", "Discover interests, ask questions and stay curious."], ["Try", "Take on a small challenge and try something new."], ["Reflect", "Talk about what worked, what didn't and what comes next."], ["Grow", "Notice effort and progress along the way."],
    ].map(([title, text], i) => <li key={title}><span className={s.journeyNumber} aria-hidden="true">0{i + 1}</span><strong>{title}</strong><p>{text}</p></li>)}</ol></div></Section>
    <Section><Eyebrow>What we’re building</Eyebrow><Heading>An early-stage initiative,<br /><Accent>shaped by questions.</Accent></Heading><p className={s.lead}>Kyro Learning is exploring practical ways to understand and support children’s development. We’re starting with a resource, an idea and an invitation to listen.</p><div className={s.buildingGrid}>{[
      ["A clearer lens", "Looking at growth beyond marks, with room for each child’s individual path."], ["Practical resources", "Simple activities for everyday moments, starting with the Home Leadership Kit."], ["Different perspectives", "An invitation to parents, caregivers, educators and interested people to share what matters."], ["An evolving idea", "What comes next is open. Your questions and suggestions can help inform it."],
    ].map(([title, text]) => <article className={s.buildingCard} key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></Section>
    <KitFeature download />
    <Invite title={<>Help Shape<br /><Accent>Kyro Learning.</Accent></>} label="Share Your Perspective">What helps children grow? What feels difficult? What support do you wish existed? We’d like to understand your perspective.</Invite>
  </>;
}
