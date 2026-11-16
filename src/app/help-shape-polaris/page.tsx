import { publicPath } from "@/lib/public-path";
import type { Metadata } from "next";
import { ConversationHero } from "@/components/pages/editorial-heroes";
import Image from "next/image";
import { Accent, ButtonLink, Eyebrow, Heading, Invite, Section } from "@/components/ui/website";
import { FeedbackForm, FeedbackGuidance } from "@/components/feedback/feedback-form";
import { perspectives } from "@/content/qualities";
import { pageMetadata } from "@/content/website-copy";
import s from "@/styles/website.module.css";
export const metadata: Metadata = { title:{absolute:pageMetadata.feedback.title}, description:pageMetadata.feedback.description };
export default function HelpPage() {
 return <>
  <ConversationHero><p>What do you wish you&apos;d learned sooner? Share your perspective on the skills and experiences children need as they grow.</p><div className={s.actions}><ButtonLink href="#conversation" variant="lime">Share Your Perspective</ButtonLink></div></ConversationHero>
  <Section><div className={s.editorialRow}><div><Eyebrow>Why we are listening</Eyebrow><Heading>Why does Kyro want<br /><Accent>your perspective?</Accent></Heading></div><p className={s.lead}>Every child and family is different. Listening to different experiences helps us ask better questions before building resources.</p></div></Section>
  <Section className={s.audience}><Eyebrow>Who can share</Eyebrow><Heading>Who can contribute?</Heading><div className={s.principleGrid}>{perspectives.map((p,i)=><div className={s.principle+" "+s[["communication","leadership","curiosity","resilience"][i]]} key={p.id}><Image src={publicPath('/images/help-shape-polaris/'+p.asset)} alt="" width={95} height={65} unoptimized/><h3>{p.label}</h3></div>)}</div></Section>
  <Section id="conversation"><div className={s.feedbackLayout}><div><Eyebrow>The conversation</Eyebrow><Heading>Share what<br /><Accent pink>matters to you.</Accent></Heading><p>Answer whichever questions are relevant. Please share at least one meaningful response.</p><FeedbackGuidance/></div><FeedbackForm/></div></Section>
  <Section><Eyebrow>What we will explore</Eyebrow><Heading>Better questions.<br /><Accent>More perspectives.</Accent></Heading><div className={s.questionGrid}>{[["question-challenge.svg","What do children need more chances to practise?"],["question-wish.svg","What helps families and educators support everyday growth?"],["question-understand.svg","What should Kyro explore next?"]].map(([asset,text],i)=><div className={s.questionCard+" "+s[["communication","leadership","resilience"][i]]} key={asset}><Image src={publicPath('/images/help-shape-polaris/'+asset)} alt="" width={64} height={64} unoptimized/><p>{text}</p></div>)}</div></Section>
  <Invite title={<>Together, we can ask<br />better questions.</>} label="Explore Our Thinking" href="/our-thinking">Kyro Learning is still taking shape. Your perspective can help guide what comes next.</Invite>
 </>;
}
