import type { Metadata } from "next";
import { ThinkingHero, PersonalProgressVisual } from "@/components/pages/editorial-heroes";
import { Accent, ButtonLink, Eyebrow, Heading, Invite, KitFeature, Photo, Section } from "@/components/ui/website";
import { QualityCards } from "@/components/pages/quality-cards";
import s from "@/styles/website.module.css";

export const metadata: Metadata = { title: "Our Thinking", description: "A bigger picture of children's everyday growth: communication, leadership, curiosity and resilience." };
export default function OurThinkingPage() {
  return <>
    <ThinkingHero>
      <p>Marks tell part of the story. A child’s ability to communicate, take initiative, ask questions and try again matters too.</p><div className={s.actions}><ButtonLink href="#qualities" variant="light">Explore the Four Qualities</ButtonLink></div>
    </ThinkingHero>
    <Section><div className={s.split}><div><Eyebrow>The perspective</Eyebrow><Heading>Growth happens in<br /><Accent>everyday moments.</Accent></Heading><p className={s.lead}>There are opportunities to learn in the small experiences at home, in school and in the world around us.</p><p>A conversation at dinner. A question on the way home. A plan that needs another try. These moments are worth paying attention to.</p></div><Photo src="home/curious-child-telescope.jpg" width={894} height={308} alt="Illustration of a child exploring with a cardboard telescope" /></div></Section>
    <Section id="qualities"><div className={s.editorialRow}><div><Eyebrow>The four qualities</Eyebrow><Heading>Different ways<br />to <Accent pink>grow.</Accent></Heading></div><p>Explore each quality for an everyday example from the Home Leadership Kit and a question to reflect on. These are starting points for conversation, not scores or assessments.</p></div><QualityCards expandable /></Section>
    <Section className={s.opportunities}><div className={s.split}><Photo src="our-thinking/our-thinking-creative-hands.jpg" width={324} height={253} alt="Illustration of a child exploring paint with their hands" /><div><Eyebrow>Everyday moments matter</Eyebrow><Heading>Real opportunities<br />to build life skills.</Heading><ul className={s.opportunityList}><li>Explain your day</li><li>Plan a family outing</li><li>Ask a new question</li><li>Talk after a setback</li></ul><p>Try a small activity, keep it relaxed and notice what happens. Let your child’s interests help guide the next step.</p></div></div></Section>
    <Section className={s.progressSection}><div className={s.split}><div><Eyebrow>Every child, their own pace</Eyebrow><Heading>Progress<br />is <Accent pink>personal.</Accent></Heading><p className={s.lead}>Every child grows differently. Compare your child with their own past, not with other children.</p><p>The kit invites you to notice effort, everyday experiences and small changes over time.</p></div><PersonalProgressVisual /></div></Section>
    <KitFeature />
    <Invite />
  </>;
}
