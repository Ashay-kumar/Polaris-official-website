import { publicPath } from "@/lib/public-path";
import type { Metadata } from "next";
import { AboutHero, ConversationCollage } from "@/components/pages/editorial-heroes";
import Image from "next/image";
import { Accent, ButtonLink, Eyebrow, Heading, Invite, Photo, Section } from "@/components/ui/website";
import s from "@/styles/website.module.css";

export const metadata: Metadata = { title: "About Polaris", description: "A beginning worth believing in. Polaris is an early-stage initiative exploring children's growth through everyday qualities, questions and practical resources." };
export default function AboutPage() {
  return <>
    <AboutHero>
      <p><strong>We’re not starting with all the answers.<br />We’re starting with better questions.</strong></p><p>Polaris is an early-stage initiative exploring how children can be supported as they develop the skills, habits and confidence that matter beyond the classroom.</p><div className={s.actions}><ButtonLink href="/help-shape-polaris#conversation" variant="lime">Help Shape Polaris</ButtonLink><ButtonLink href="/our-thinking" variant="secondary">Our Thinking</ButtonLink></div>
    </AboutHero>
    <Section><div className={s.split}><Photo src="home/children-together-path.jpg" width={755} height={322} alt="Illustration of children sharing a path outdoors; a temporary image for this composition" /><div><Heading>Why <Accent>Polaris exists.</Accent></Heading><p className={s.lead}>Academic learning matters. It builds important foundations. But it doesn’t capture everything that helps a child grow.</p><p>Polaris is exploring the everyday qualities, experiences and environments that also shape children’s development.</p></div></div></Section>
    <Section><Eyebrow>Our guiding principles</Eyebrow><Heading>What guides us.</Heading><div className={s.principleGrid}>{[
      ["principle-whole-child.svg","See the whole child"], ["principle-everyday-growth.svg","Value everyday growth"], ["principle-individual-progress.svg","Celebrate individual progress"], ["principle-listen.svg","Listen before building"],
    ].map(([asset,title],i)=><article className={`${s.principle} ${s[["communication","leadership","curiosity","resilience"][i]]}`} key={title}><Image src={publicPath(`/images/about/${asset}`)} width={95} height={65} alt="" unoptimized /><h3>{title}</h3></article>)}</div></Section>
    <Section className={s.progressSection}><div className={s.editorialRow}><div><Eyebrow>Where we are today</Eyebrow><Heading>A work in progress,<br /><Accent pink>by design.</Accent></Heading></div><p>There’s an idea to explore, a practical kit to try and an open invitation to contribute. The next chapter is still being shaped.</p></div><ol className={s.timeline}>{[
      ["Exploring the idea","Our starting point"], ["Sharing a practical resource","The Home Leadership Kit"], ["Inviting perspectives","Listening before building"], ["Shaping what comes next","Still open"],
    ].map(([title,status],i)=><li key={title}><span aria-hidden="true">{i+1}</span><strong>{title}</strong><small>{status}</small></li>)}</ol></Section>
    <Section><div className={s.split}><ConversationCollage /><div><Eyebrow>Built through conversations</Eyebrow><Heading>Different experiences.<br /><Accent>Better questions.</Accent></Heading><p>Parents, caregivers, educators, child-development professionals and interested people all bring different perspectives.</p><p>We’d like to understand your experiences and ideas. You don’t need to have an answer to every question to help shape what comes next.</p></div></div></Section>
    <Invite title={<>The next chapter<br />includes you.</>}>Have a perspective on children’s everyday growth? Explore the conversation and tell us what you would like Polaris to understand.</Invite>
  </>;
}
