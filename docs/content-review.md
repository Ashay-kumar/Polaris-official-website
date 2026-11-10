# Stage 02 content review

11 November 2026. All marketing copy is provisional until founder review. The implementation makes no claim of established users, research results, clinical outcomes, partnerships, team members or company milestones.

## Authoritative resource content

`src/content/activities.json` contains all twelve activities from the user-confirmed original six-page Home Leadership Kit. Names, full durations, How instructions, Why it helps text and Ages guidance were extracted from its text streams. Only line-break whitespace and escaped PDF parentheses were normalised. Activity grouping maps the PDF's Leadership and initiative section to the requested interface label Leadership. The original PDF bytes remain unchanged.

The four concise definitions in `src/content/qualities.ts` come from page one of the kit. The expanded examples are summaries of identified activities; reflection questions are newly written editorial prompts, not research findings. Activity rationales are reproduced as source content, not presented as independently validated evidence.

## Proposed website wording requiring review

| Route/source | Provisional content |
| --- | --- |
| `/`, `src/app/page.tsx` | Hero supporting paragraph; manifesto; four-stage path descriptions; What we're building descriptions; kit supporting paragraph and invitation |
| `/our-thinking`, `src/app/our-thinking/page.tsx` | Report-card headline/supporting copy; perspective and everyday-opportunity text; personal-progress supporting text |
| `src/content/qualities.ts` | Expanded activity summaries and all four reflection questions; concise definitions are kit source text |
| `/home-leadership-kit`, `src/app/home-leadership-kit/page.tsx` | Headings, introductions, condensed How it works summaries and download descriptions. Full activity disclosures remain source text. Spotlight is a close prose rendering of activity one; tracker retains the four original headings. |
| `/help-shape-polaris`, `src/app/help-shape-polaris/page.tsx` | Listening/audience explanations, invitation and all question wording |
| `src/components/feedback/feedback-form.tsx` | Questions, validation messages, preview disclosure and draft follow-up wording. No wording establishes an approved privacy/retention policy. |
| `/about`, `src/app/about/page.tsx` | Hero narrative; why Polaris exists; current-stage descriptions; conversation invitation. The four principle titles come from the requested brief. |
| `src/components/layout/site-footer.tsx` | Brand description and closing phrase. No unprovided social, contact, terms or privacy-policy destination is invented. |
| `src/components/ui/website.tsx` | Shared kit feature and CTA prose |
| Route metadata | Search titles and descriptions; all pages remain non-indexable in preview |

The timeline describes a starting idea, an available kit, an invitation and an undecided next step. It does not claim completed consultation, measured progress, a launched product or an established community. About images are explicitly illustrative and do not identify real Polaris participants.

## Reference reconciliation

Current files were inspected directly. The kit mobile reference now exists as `design-references/03-home-leadership-kit/home-leadership-kit-mobile-approved.png.png` (900x5520). About mobile is `design-references/05-about/about-mobile-approved.png.png`. Existing filenames are preserved. The current supplied asset-inventory.json already records both actual paths; no rename or silent remapping was performed.

Home mobile storyboard panels are implemented as one consecutive vertical experience, retaining all seven required desktop narrative sections. Its alternate headline/copy is not treated as a separate authoritative content source. Distorted About mobile text and mockup logos were not copied. The exact integrated production logo remains canonical.

Approve the provisional copy, especially the four quality summaries, timeline wording, age framing, privacy disclosure and follow-up consent, before release.

## Stage 03 visual copy additions

`src/components/pages/editorial-heroes.tsx` preserves each current hero's core headline and the existing supporting paragraphs/CTA destinations passed from its page. The four original quality names remain visible in Home's new quality rail. Added editorial text is provisional: the report-card qualification, Questions / Ideas / Possibilities annotation, three conversation prompts, progress-photo caption/note, conversation-start cue and collage caption. These are visual/editorial prompts, not claims of research, assessment or participation.

Kit preview captions identify actual pages 1, 2 and 6. Preview pixels, including original document colours and wording, are faithful to the source PDF; they are not a redesigned cover or newly written document. The source PDF still includes its original check-in/WhatsApp wording; no corresponding service or endpoint is invented on the website.
