import type { Metadata } from "next";
import { HomeHero } from "@/components/pages/editorial-heroes";
import { Accent, ButtonLink, Eyebrow, Heading, Invite, KitFeature, Section } from "@/components/ui/website";
import { QualityCards } from "@/components/pages/quality-cards";
import { pageMetadata } from "@/content/website-copy";
import s from "@/styles/website.module.css";
export const metadata: Metadata = { title: {absolute:pageMetadata.home.title}, description:pageMetadata.home.description };
export default function FoundationPage() {
 return <>
  <HomeHero><p><strong>The lessons we wish we&apos;d learned sooner.</strong></p><p>Speaking up. Trying something new. Finding our feet when life changes. What if children had more chances to practise these qualities while growing up?</p><div className={s.actions}><ButtonLink href="/about#why-kyro-exists">Why Kyro Exists</ButtonLink><ButtonLink href="/our-thinking" variant="secondary">Explore Our Thinking</ButtonLink></div></HomeHero>
  <Section><div className={s.editorialRow}><div><Eyebrow>The problem</Eyebrow><Heading>Are good marks enough<br />to prepare us for <Accent pink>life?</Accent></Heading></div><p className={s.lead}>Academic learning matters. But new places, new responsibilities and unexpected setbacks also call for confidence, communication and resilience.</p></div></Section>
  <Section><div className={s.editorialRow}><div><Eyebrow>Our purpose</Eyebrow><Heading>What if we<br /><Accent>started earlier?</Accent></Heading></div><p className={s.lead}>Kyro Learning explores simple ways to help children practise important life skills through everyday experiences, without adding more academic pressure.</p></div></Section>
  <Section id="four-qualities"><Eyebrow>Four qualities</Eyebrow><Heading>Four qualities.<br /><Accent>Everyday opportunities.</Accent></Heading><QualityCards descriptions={{communication:"Share ideas. Listen to others.",leadership:"Take initiative. Own small decisions.",curiosity:"Ask questions. Explore possibilities.",resilience:"Face setbacks. Try again."}}/></Section>
  <Section><Eyebrow>Everyday moments</Eyebrow><Heading>Growth can begin<br />with <Accent pink>small moments.</Accent></Heading><div className={s.journey}><ol className={s.journeySteps} style={{gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 15rem), 1fr))"}}>{["A question at dinner.","A new responsibility.","A game that needs teamwork."].map(moment=><li key={moment}><strong>{moment}</strong></li>)}</ol></div><p className={s.lead}>Every experience can open a conversation and a chance to learn.</p></Section>
  <KitFeature/>
  <Invite title={<>What do you wish you<br />had learned sooner?</>} label="Share Your Perspective">Share your experience and help shape what Kyro explores next.</Invite>
  <Section><Eyebrow>Short answers</Eyebrow><Heading>What is Kyro Learning?</Heading><p className={s.lead}>Kyro Learning is an early-stage initiative exploring everyday ways to support children&apos;s growth beyond academics.</p></Section>
 </>;
}
