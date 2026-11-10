import { publicPath } from "@/lib/public-path";
import type { Metadata } from "next";
import { ConversationHero } from "@/components/pages/editorial-heroes";
import Image from "next/image";
import { Accent, ButtonLink, Eyebrow, Heading, Invite, Section } from "@/components/ui/website";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { perspectives } from "@/content/qualities";
import s from "@/styles/website.module.css";

export const metadata: Metadata = { title: "Help Shape Polaris", description: "Explore a guided conversation about children's everyday growth and the support you wish existed. Feedback submission is unavailable in this local preview." };
export default function HelpPage() {
  return <>
    <ConversationHero>
      <p>We’re in the early stages of building Polaris. We’d like to understand your experiences, challenges and ideas before deciding what comes next.</p><div className={s.actions}><ButtonLink href="#conversation" variant="lime">Share Your Perspective</ButtonLink></div>
    </ConversationHero>
    <Section><div className={s.editorialRow}><Heading>Why we’re<br /><Accent>listening.</Accent></Heading><p className={s.lead}>Every child is different, and so is every family, classroom and community. Your perspective can help us understand what’s needed, what feels difficult and what we should explore next.</p></div></Section>
    <Section className={s.audience}><Eyebrow>Different perspectives welcome</Eyebrow><Heading>Who can share?</Heading><div className={s.principleGrid}>{perspectives.map((p,i)=><div className={`${s.principle} ${s[["communication","leadership","curiosity","resilience"][i]]}`} key={p.id}><Image src={publicPath(`/images/help-shape-polaris/${p.asset}`)} alt="" width={95} height={65} unoptimized /><h3>{p.label}</h3></div>)}</div></Section>
    <Section id="conversation"><div className={s.feedbackLayout}><div><Eyebrow>A few thoughtful questions</Eyebrow><Heading>It’s a simple<br /><Accent pink>conversation.</Accent></Heading><p>Share a challenge, an idea or something we should understand. Your own experience is a useful place to start.</p><p className={s.privacyNote}>This is a local preview. You can explore the full conversation, but submission is not yet enabled.</p></div><FeedbackForm /></div></Section>
    <Section><Eyebrow>What we’ll explore</Eyebrow><Heading>Better questions.<br /><Accent>More perspectives.</Accent></Heading><div className={s.questionGrid}>{[
      ["question-challenge.svg","What’s one challenge you see in supporting children’s growth?"], ["question-wish.svg","What resources or support do you wish existed?"], ["question-understand.svg","What should Polaris understand before building further?"],
    ].map(([asset,text],i)=><div className={`${s.questionCard} ${s[["communication","leadership","resilience"][i]]}`} key={asset}><Image src={publicPath(`/images/help-shape-polaris/${asset}`)} alt="" width={64} height={64} unoptimized /><p>{text}</p></div>)}</div></Section>
    <Invite title={<>Together, we can ask<br />better questions.</>} label="Explore the Conversation">Polaris is still taking shape. We want to listen before deciding what to build.</Invite>
  </>;
}
