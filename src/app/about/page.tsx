import { publicPath } from "@/lib/public-path";
import type { Metadata } from "next";
import { AboutHero, ConversationCollage } from "@/components/pages/editorial-heroes";
import Image from "next/image";
import { Accent, ButtonLink, Eyebrow, Heading, Invite, Photo, Section } from "@/components/ui/website";
import { pageMetadata } from "@/content/website-copy";
import s from "@/styles/website.module.css";
export const metadata: Metadata = { alternates: { canonical: "/about/" }, title:{absolute:pageMetadata.about.title}, description:pageMetadata.about.description };
export default function AboutPage() {
 return <>
  <AboutHero><p><strong>We&apos;re not starting with all the answers. We&apos;re starting with better questions.</strong></p><p>Kyro Learning is an early-stage initiative exploring how children can develop life skills through everyday experiences.</p><div className={s.actions}><ButtonLink href="/help-shape-polaris#conversation" variant="lime">Help Shape Kyro Learning</ButtonLink><ButtonLink href="/our-thinking" variant="secondary">Our Thinking</ButtonLink></div></AboutHero>
  <Section id="why-kyro-exists"><div className={s.split}><Photo src="home/children-together-path.jpg" width={755} height={322} alt="Illustration of children sharing a path outdoors; a temporary image for this composition"/><div><Eyebrow>Why Kyro exists</Eyebrow><Heading>Why was<br /><Accent>Kyro Learning started?</Accent></Heading><p className={s.lead}>Many of us recognise the value of speaking up, adjusting to change and handling setbacks only as we grow older.</p><p>Kyro began with a question: what if children had more opportunities to practise these qualities earlier?</p></div></div></Section>
  <Section><Eyebrow>Guiding principles</Eyebrow><Heading>What guides us?</Heading><div className={s.principleGrid}>{[
   ["principle-whole-child.svg","See the whole child","Look beyond marks and labels."],["principle-everyday-growth.svg","Value everyday growth","Notice effort, experiences and small steps."],["principle-individual-progress.svg","Celebrate individual progress","Respect different strengths and paces."],["principle-listen.svg","Listen before building","Learn from families, educators and others."],
  ].map(([asset,title,text],i)=><article className={s.principle+" "+s[["communication","leadership","curiosity","resilience"][i]]} key={title}><Image src={publicPath('/images/about/'+asset)} width={95} height={65} alt="" unoptimized/><h3>{title}</h3><p>{text}</p></article>)}</div></Section>
  <Section className={s.progressSection}><div className={s.editorialRow}><div><Eyebrow>Where we are today</Eyebrow><Heading>A work in progress,<br /><Accent pink>by design.</Accent></Heading></div><p>We are exploring the idea, sharing the Home Leadership Kit and inviting perspectives to help shape what comes next.</p></div><ol className={s.timeline}>{["Explore the idea","Share a practical resource","Listen to perspectives","Shape what comes next"].map((title,i)=><li key={title}><span aria-hidden="true">0{i+1}</span><strong>{title}</strong></li>)}</ol></Section>
  <Section><div className={s.split}><ConversationCollage/><div><Eyebrow>Built through conversations</Eyebrow><Heading>Different experiences.<br /><Accent>Better questions.</Accent></Heading><p>Parents, caregivers, educators and child-development professionals bring valuable perspectives. We want to listen before deciding what to build next.</p></div></div></Section>
  <Invite title={<>The next chapter<br />includes you.</>}>Share what you believe children need more opportunities to practise.</Invite>
 </>;
}
