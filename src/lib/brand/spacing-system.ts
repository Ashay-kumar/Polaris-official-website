export interface SpacingToken { name: string; value: string; usage: string }
export const spacingStatus = "Approved";
export const spacingScale: SpacingToken[] = [
  { name: "--space-0", value: "0rem", usage: "No separation; intentional resets." },
  { name: "--space-half", value: "0.125rem", usage: "Half-unit optical adjustment only; not a control gap." },
  ...[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map((step) => ({ name: `--space-${step}`, value: `${step / 4}rem`, usage: step <= 2 ? "Micro spacing within a related group." : step <= 6 ? "Internal padding, field spacing and compact groups." : step <= 12 ? "Group separation and sections." : "Major sections and page composition; reduce on narrow screens." })),
];
export const layoutTokens: SpacingToken[] = [
  { name: "--layout-container-compact", value: "40rem", usage: "Focused tasks; a maximum, not a fixed width." },
  { name: "--layout-container-standard", value: "72rem", usage: "General product content; retain page gutters." },
  { name: "--layout-container-wide", value: "90rem", usage: "Multi-panel workspaces where content benefits from width." },
  { name: "--layout-reading-measure", value: "65ch", usage: "Reading column; consistent with the typography specimen." },
  { name: "--layout-card-min", value: "16rem", usage: "Preferred auto-fit card minimum; clamp to available width." },
  { name: "--space-inset-compact", value: "var(--space-3)", usage: "Compact supporting panels, not a prescribed control size." },
  { name: "--space-inset-card", value: "var(--space-6)", usage: "Default illustrative card padding." },
  { name: "--space-field-gap", value: "var(--space-2)", usage: "Persistent label, field and help-text relationship." },
  { name: "--space-form-group", value: "var(--space-6)", usage: "Separation between related field groups." },
];
export const layoutRanges = [
  { name: "Narrow", minRem: 0, gutter: "--space-4", gap: "--space-4", section: "--space-8", columns: 1 },
  { name: "Medium", minRem: 50, gutter: "--space-6", gap: "--space-6", section: "--space-12", columns: 2 },
  { name: "Wide", minRem: 75, gutter: "--space-8", gap: "--space-8", section: "--space-16", columns: 3 },
] as const;
export const spacingHeadings = [
  { id: "spacing-principles", title: "Structure and scope" },
  { id: "spacing-scale", title: "Spacing scale" },
  { id: "layout-roles", title: "Layout roles and containers" },
  { id: "responsive-layout", title: "Responsive ranges" },
  { id: "layout-specimens", title: "Grids and composition" },
  { id: "grouping", title: "Cards and form grouping" },
  { id: "layout-accessibility", title: "Reflow and accessibility" },
  { id: "layout-implementation", title: "Implementation" },
] as const;
export function resolveSpacing(name: string): string {
  const token = [...spacingScale, ...layoutTokens].find((token) => token.name === name);
  if (!token) throw new Error(`Unknown spacing token: ${name}`);
  const alias = token.value.match(/^var\((--[\w-]+)\)$/);
  return alias ? resolveSpacing(alias[1]) : token.value;
}
export function generatedSpacingCss() {
  const rangeVariables = (range: typeof layoutRanges[number]) => `  --layout-page-gutter: var(${range.gutter});\n  --layout-grid-gap: var(${range.gap});\n  --layout-section-gap: var(${range.section});\n  --layout-preferred-columns: ${range.columns};\n  --layout-pair-columns: ${Math.min(range.columns, 2)};\n  --layout-main-tracks: ${range.columns === 1 ? "minmax(0, 1fr)" : "minmax(0, 2fr) minmax(0, 1fr)"};`;
  return `/* Generated from src/lib/spacing-system.ts. All specifications Approved. */\n:root {\n${[...spacingScale, ...layoutTokens].map((token) => `  ${token.name}: ${token.value};`).join("\n")}\n${rangeVariables(layoutRanges[0])}\n}\n${layoutRanges.slice(1).map((range) => `@media (min-width: ${range.minRem}rem) {\n  :root {\n${rangeVariables(range)}\n  }\n}`).join("\n")}\n`;
}
