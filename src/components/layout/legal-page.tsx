import { AnalyticsPreference } from "./analytics-preference";
import Link from "@/components/ui/site-link";
import policies from "@/content/policies.json";
import s from "./legal.module.css";

export type PolicySlug = keyof typeof policies;
function PolicyText({ text }: { text: string }) {
  return text.split(/(info@kyrolearning\.com|https:\/\/kyrolearning\.com|Privacy Policy|Cookie Policy)/g).map((part, i) => {
    if (part === "info@kyrolearning.com") return <a key={i} href={"mailto:" + part}>{part}</a>;
    if (part === "https://kyrolearning.com") return <a key={i} href={part}>{part}</a>;
    if (part === "Privacy Policy") return <Link key={i} href="/privacy-policy">{part}</Link>;
    if (part === "Cookie Policy") return <Link key={i} href="/cookie-policy">{part}</Link>;
    return part;
  });
}
export function LegalPage({ slug }: { slug: PolicySlug }) {
  const policy = policies[slug];
  return <article className={s.page} data-policy-id={policy.id}>
    <header><h1>{policy.title}</h1><p className={s.identifier}>Document identifier: {policy.id}</p></header>
    {policy.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2>
      {section.blocks.map((block, index, blocks) => {
        if (block.type !== "item") return <p key={index}><PolicyText text={block.text}/></p>;
        if (index && blocks[index - 1].type === "item") return null;
        const items = []; for (let i = index; i < blocks.length && blocks[i].type === "item"; i++) items.push(blocks[i]);
        return <ul key={index}>{items.map(item => <li key={item.text}><PolicyText text={item.text}/></li>)}</ul>;
      })}{slug === "cookie-policy" && section.heading === "4. Your analytics choice" && <AnalyticsPreference />}</section>)}
  </article>;
}
