export type VisualKind = "iconography" | "imagery" | "shapes" | "motion";
export const visualPages = [
  { slug: "iconography", title: "Iconography", description: "Selected Phosphor icon family, with documented size, weight, alignment and accessible usage specifications.", status: "Approved", kind: "iconography" },
  { slug: "imagery", title: "Imagery & illustration", description: "Approved photography, illustration and image-accessibility guidance grounded in child dignity and source-established principles.", status: "Approved", kind: "imagery" },
  { slug: "shapes", title: "Shapes, borders & elevation", description: "Approved radii, borders, dividers, surface treatments, elevation and overlay specifications.", status: "Approved", kind: "shapes" },
  { slug: "motion", title: "Motion", description: "Approved functional motion, duration and easing tokens, reduced-motion behaviour and state-transition guidance.", status: "Approved", kind: "motion" },
] as const;
export const isVisualKind = (kind: string): kind is VisualKind => visualPages.some((page) => page.kind === kind);
export const visualHeadings = {
  iconography: [{ id: "icon-direction", title: "Direction and library" }, { id: "polaris-icon-family", title: "Polaris Icon Family" }, { id: "icon-metrics", title: "Size and geometry" }, { id: "icon-usage", title: "Usage and accessibility" }, { id: "icon-development", title: "Implementation" }],
  imagery: [{ id: "image-principles", title: "Source principles and scope" }, { id: "photography", title: "Photography and representation" }, { id: "image-care", title: "Dignity, privacy and consent" }, { id: "composition", title: "Composition and colour" }, { id: "illustration", title: "Illustration and abstract concepts" }, { id: "image-accessibility", title: "Image accessibility" }],
  shapes: [{ id: "surface-language", title: "Surface language" }, { id: "shape-tokens", title: "Radii and borders" }, { id: "surface-tokens", title: "Surfaces, shadows and overlays" }, { id: "surface-guidance", title: "Usage and implementation" }],
  motion: [{ id: "motion-purpose", title: "Purpose and limits" }, { id: "motion-tokens", title: "Duration and easing" }, { id: "motion-specimen", title: "State-transition specimen" }, { id: "reduced-motion", title: "Reduced motion" }],
} as const;
export interface VisualToken { name: string; value: string; group: "icon" | "shape" | "surface" | "motion"; usage: string }
export const visualTokens: VisualToken[] = [
  { name: "--icon-size-small", value: "1rem", group: "icon", usage: "16px at default root; secondary inline icons only after optical review." },
  { name: "--icon-size-medium", value: "1.25rem", group: "icon", usage: "20px at default root; compact interface context." },
  { name: "--icon-size-default", value: "1.5rem", group: "icon", usage: "24px at default root; default icon canvas, not hit-target size." },
  { name: "--icon-size-large", value: "2rem", group: "icon", usage: "32px at default root; restrained supporting emphasis." },
  { name: "--radius-none", value: "0px", group: "shape", usage: "Flush regions and structural edges." },
  { name: "--radius-small", value: "0.25rem", group: "shape", usage: "4px at default root; consistent with existing documentation controls." },
  { name: "--radius-medium", value: "0.5rem", group: "shape", usage: "8px at default root; documented grouping panels." },
  { name: "--radius-large", value: "1rem", group: "shape", usage: "16px at default root; selective supporting surfaces, not every card." },
  { name: "--radius-pill", value: "999px", group: "shape", usage: "Purposeful compact tags; not a default control shape." },
  { name: "--radius-control", value: "var(--radius-small)", group: "shape", usage: "Functional control geometry proposal." },
  { name: "--radius-panel", value: "var(--radius-medium)", group: "shape", usage: "Supporting panel geometry proposal." },
  { name: "--border-width-default", value: "1px", group: "shape", usage: "Default structural boundary; choose colour by meaning." },
  { name: "--border-width-emphasis", value: "2px", group: "shape", usage: "Selected or emphasised boundary; accompany with state/label." },
  { name: "--border-width-focus", value: "3px", group: "shape", usage: "Matches the current visible focus outline width." },
  { name: "--focus-outline-offset", value: "var(--space-1)", group: "shape", usage: "Existing 4px focus clearance at default root; preserve room around controls." },
  { name: "--divider-width", value: "var(--border-width-default)", group: "surface", usage: "Decorative separator thickness." },
  { name: "--divider-colour", value: "var(--color-border-default)", group: "surface", usage: "Decorative division only; not an essential control boundary." },
  { name: "--surface-treatment-flat", value: "var(--color-surface-primary)", group: "surface", usage: "Default neutral content surface." },
  { name: "--surface-treatment-subtle", value: "var(--color-surface-secondary)", group: "surface", usage: "Quiet grouping surface; not a status signal." },
  { name: "--surface-treatment-inverse", value: "var(--color-surface-inverse)", group: "surface", usage: "Dark surface paired with inverse text and inverse focus." },
  { name: "--elevation-flat", value: "none", group: "surface", usage: "Default; structure should not depend on shadows." },
  { name: "--elevation-raised", value: "0 2px 8px color-mix(in srgb, var(--color-brand-ink) 10%, transparent)", group: "surface", usage: "Local raised surface with an independent boundary." },
  { name: "--elevation-floating", value: "0 8px 24px color-mix(in srgb, var(--color-brand-ink) 16%, transparent)", group: "surface", usage: "Floating surface, subject to later overlay/component review." },
  { name: "--overlay-scrim", value: "color-mix(in srgb, var(--color-brand-ink) 40%, transparent)", group: "surface", usage: "Deep Ink at 40%, matching the existing backdrop intent. Not a text surface." },
  { name: "--motion-duration-instant", value: "0ms", group: "motion", usage: "Immediate state or reduced-motion feedback." },
  { name: "--motion-duration-fast", value: "100ms", group: "motion", usage: "Small pointer/focus state changes; keep feedback immediate." },
  { name: "--motion-duration-standard", value: "160ms", group: "motion", usage: "Brief visual continuity between local states." },
  { name: "--motion-duration-deliberate", value: "240ms", group: "motion", usage: "Occasional spatial context only after testing; no intentional wait for an action." },
  { name: "--motion-easing-standard", value: "cubic-bezier(0.2, 0, 0, 1)", group: "motion", usage: "Settled, non-springing state change." },
  { name: "--motion-easing-enter", value: "cubic-bezier(0, 0, 0.2, 1)", group: "motion", usage: "Approved arrival curve; no new modal behaviour is specified." },
  { name: "--motion-easing-exit", value: "cubic-bezier(0.4, 0, 1, 1)", group: "motion", usage: "Approved departure curve; do not delay removal of obsolete state." },
];
export function generatedVisualCss() {
  const durations = visualTokens.filter((token) => token.name.startsWith("--motion-duration-"));
  return `/* Generated from src/lib/visual-foundations.ts. All specifications Approved. */\n:root {\n${visualTokens.map((token) => `  ${token.name}: ${token.value};`).join("\n")}\n}\n@media (prefers-reduced-motion: reduce) {\n  :root {\n${durations.map((token) => `    ${token.name}: 0ms;`).join("\n")}\n  }\n}\n`;
}
