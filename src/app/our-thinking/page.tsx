import type { Metadata } from "next";
import { ThinkingHero, PersonalProgressVisual } from "@/components/pages/editorial-heroes";
import { Accent, ButtonLink, Eyebrow, Heading, Invite, KitFeature, Photo, Section } from "@/components/ui/website";
import { QualityCards } from "@/components/pages/quality-cards";
import { pageMetadata } from "@/content/website-copy";
import s from "@/styles/website.module.css";
export const metadata: Metadata = { alternates: { canonical: "/our-thinking/" }, title:{absolute:pageMetadata.thinking.title}, description:pageMetadata.thinking.description };
export default function OurThinkingPage() {
 return <>
  <ThinkingHero><p>Marks tell part of the story. The way children communicate, explore, take initiative and recover from setbacks matters too.</p><div className={s.actions}><ButtonLink href="#qualities" variant="light">Explore the Four Qualities</ButtonLink></div></ThinkingHero>
  <Section><div className={s.split}><div><Eyebrow>The perspective</Eyebrow><Heading>Why look beyond<br /><Accent>academic scores?</Accent></Heading><p className={s.lead}>Academic progress is important, but it cannot capture every skill, habit or experience that shapes a child&apos;s growth.</p></div><Photo src="home/curious-child-telescope.jpg" width={894} height={308} alt="Illustration of a child exploring with a cardboard telescope"/></div></Section>
  <Section id="qualities"><Eyebrow>Four qualities</Eyebrow><Heading>What qualities<br />does <Accent pink>Kyro explore?</Accent></Heading><QualityCards expandable descriptions={{communication:"Expressing ideas and listening with care.",leadership:"Taking initiative and sharing responsibility.",curiosity:"Asking why and learning through discovery.",resilience:"Learning from difficulty and trying again."}}/></Section>
  <Section className={s.opportunities}><div className={s.split}><Photo src="our-thinking/our-thinking-creative-hands.jpg" width={324} height={253} alt="Illustration of a child exploring paint with their hands"/><div><Eyebrow>Everyday moments</Eyebrow><Heading>Where can children<br />practise these skills?</Heading><ul className={s.opportunityList}><li><strong>At home</strong><p>Explain a decision or plan a family activity.</p></li><li><strong>At school</strong><p>Ask a new question or help a classmate.</p></li><li><strong>With others</strong><p>Take turns, solve a problem or recover after a setback.</p></li></ul></div></div></Section>
  <Section className={s.progressSection}><div className={s.split}><div><Eyebrow>Individual progress</Eyebrow><Heading>Does every child<br />grow <Accent pink>the same way?</Accent></Heading><p className={s.lead}>No. Every child has different interests, strengths and needs. Progress is personal, not a competition.</p></div><PersonalProgressVisual/></div></Section>
  <KitFeature title={<>Try the Home<br />Leadership Kit.</>} description="A free collection of 12 at-home activities for children aged 5-14."/>
  <Invite title={<>Your perspective<br />matters.</>}>What helps children grow? Tell us what you&apos;ve seen, tried or wished for.</Invite>
 </>;
}
