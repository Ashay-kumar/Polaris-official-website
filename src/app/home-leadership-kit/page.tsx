import type { Metadata } from "next";
import { KitHero } from "@/components/pages/editorial-heroes";
import { Accent, ButtonLink, Eyebrow, Heading, Invite, KitCover, Section } from "@/components/ui/website";
import { ActivityExplorer } from "@/components/pages/activity-explorer";
import { kitDownload } from "@/content/qualities";
import { pageMetadata } from "@/content/website-copy";
import s from "@/styles/website.module.css";

export const metadata: Metadata = { title:{absolute:pageMetadata.kit.title}, description:pageMetadata.kit.description };
export default function KitPage() {
  return <>
    <KitHero>
      <p>12 simple at-home activities to help children explore communication, leadership, curiosity and resilience. For ages 5-14.</p><div className={s.actions}><ButtonLink href="#activities" variant="primary">Explore the Activities</ButtonLink><ButtonLink href={kitDownload} variant="secondary" download>Download the Kit</ButtonLink></div>
    </KitHero>
    <Section><Eyebrow>01 / How it works</Eyebrow><Heading>Small steps.<br />Real moments.</Heading><ol className={s.howGrid}>{[
      ["Choose a quality", "Start with communication, leadership, curiosity or resilience."], ["Try an activity", "Choose an age-appropriate task and give it a go."], ["Keep it light", "Make space for effort, questions and enjoyment."], ["Reflect together", "Talk about what worked and what to try next."],
    ].map(([title,text],i)=><li key={title} className={s[["communication","leadership","curiosity","resilience"][i]]}><span className={s.number}>0{i+1}</span><strong>{title}</strong><p>{text}</p></li>)}</ol></Section>
    <Section id="activities"><Eyebrow>02 / The activity collection</Eyebrow><Heading>12 ways<br />to <Accent>grow.</Accent></Heading><p>Explore three activities in each quality. Choose one, try it at home and notice what unfolds.</p><ActivityExplorer /></Section>
    <Section><div className={s.split}><div><Eyebrow>03 / Activity spotlight</Eyebrow><Heading>Try one today:<br /><Accent pink>Three-part day.</Accent></Heading><p className={s.lead}>Three-part day · 10 minutes, at dinner</p><p>At dinner, ask your child to share one beginning, one middle and one ending from their day. Listen, then ask one curious follow-up question.</p><p>For ages 5 to 8, use pictures or a drawing as prompts. For ages 9 to 14, ask them to include one thing that surprised them.</p></div><div className={s.spotlightNote}><h3>Three-part day</h3><ol><li>A beginning</li><li>A middle</li><li>An end</li></ol><p>Then ask one curious follow-up question.</p><strong>Keep it light. Enjoyment is the point.</strong></div></div></Section>
    <Section id="tracker"><div className={s.split}><div className={s.trackerWrap}><table className={s.tracker}><caption className="sr-only">Four-week tracker preview from page seven of the kit</caption><thead><tr><th scope="col">Week</th><th scope="col">Quality and activity</th><th scope="col">What I noticed</th><th scope="col">What to try next</th></tr></thead><tbody>{[1,2,3,4].map(n=><tr key={n}><th scope="row">{n}</th><td /><td /><td /></tr>)}</tbody></table></div><div><Eyebrow>04 / The four-week tracker</Eyebrow><Heading>Notice the<br /><Accent>little wins.</Accent></Heading><p>Use the printable tracker to record what your child tried, what they noticed and what they want to explore next.</p><p>Compare progress with their own starting point.</p><ButtonLink href={kitDownload} variant="secondary">View the Tracker in the Kit</ButtonLink><p className={s.caption}>This is a reflection guide, not a clinical or psychological assessment.</p></div></div></Section>
    <Section className={s.downloadSection}><div className={s.split}><div><Eyebrow>05 / Take the kit home</Eyebrow><Heading>Bring the<br />experience home.</Heading><p className={s.lead}>Get all 12 activities, age guidance and the four-week tracker in one free kit.</p><ButtonLink href={kitDownload} download>Download the Free Kit</ButtonLink><p className={s.caption}>A reflection and activity guide, not a clinical or psychological assessment.</p></div><KitCover /></div></Section>
    <Invite title={<>Help us learn<br />from you.</>} label="Share Your Experience">Tried an activity? Tell us what worked, what did not and what you would like to see next.</Invite>
  </>;
}
