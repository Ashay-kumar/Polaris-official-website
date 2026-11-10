export interface TypographyToken {
  name: string;
  family: "editorial" | "body";
  size: string;
  weight: 400 | 600 | 700;
  lineHeight: number;
  letterSpacing: string;
  usage: string;
}

// Founder-selected families; all role metrics and mappings remain Approved.
export const fontFamilies = {
  editorial: 'var(--loaded-font-editorial, "DM Serif Display"), Georgia, serif',
  body: 'var(--loaded-font-body, "Source Sans 3"), "Segoe UI", Arial, sans-serif',
} as const;

export const typographyTokens: TypographyToken[] = [
  { name: "display", family: "editorial", size: "clamp(2.6875rem, 4.4vw, 4rem)", weight: 400, lineHeight: 1.08, letterSpacing: "-0.028125em", usage: "Short editorial openings; not dense product screens." },
  { name: "h1", family: "editorial", size: "clamp(2rem, 1.5rem + 2vw, 3rem)", weight: 400, lineHeight: 1.15, letterSpacing: "-0.02em", usage: "Product page title; one clear primary heading." },
  { name: "h2", family: "body", size: "clamp(1.75rem, 1.5rem + 1vw, 2rem)", weight: 600, lineHeight: 1.25, letterSpacing: "-0.015em", usage: "Major content groups in product views." },
  { name: "h3", family: "body", size: "clamp(1.375rem, 1.3125rem + 0.25vw, 1.4375rem)", weight: 600, lineHeight: 1.2, letterSpacing: "-0.02em", usage: "Compact sections and documentation section headings." },
  { name: "h4", family: "body", size: "1.25rem", weight: 600, lineHeight: 1.3, letterSpacing: "0em", usage: "Subsections and grouped information." },
  { name: "h5", family: "body", size: "1.125rem", weight: 600, lineHeight: 1.4, letterSpacing: "0em", usage: "Small panel headings." },
  { name: "h6", family: "body", size: "1rem", weight: 700, lineHeight: 1.5, letterSpacing: "0em", usage: "Lowest-level heading; avoid unnecessary nesting." },
  { name: "lead", family: "body", size: "clamp(1.0625rem, 1rem + 0.25vw, 1.125rem)", weight: 400, lineHeight: 1.6, letterSpacing: "0em", usage: "Short page introductions; not entire articles." },
  { name: "body-large", family: "body", size: "1.125rem", weight: 400, lineHeight: 1.6, letterSpacing: "0em", usage: "Reading-led content with generous space." },
  { name: "body", family: "body", size: "1rem", weight: 400, lineHeight: 1.6, letterSpacing: "0em", usage: "Default paragraphs, forms and functional communication." },
  { name: "body-small", family: "body", size: "0.875rem", weight: 400, lineHeight: 1.6, letterSpacing: "0em", usage: "Secondary information; do not shrink essential instructions." },
  { name: "label", family: "body", size: "0.875rem", weight: 600, lineHeight: 1.5, letterSpacing: "0em", usage: "Persistent form labels and navigation text." },
  { name: "button", family: "body", size: "0.875rem", weight: 600, lineHeight: 1.5, letterSpacing: "0em", usage: "Action labels; size the hit target separately." },
  { name: "caption", family: "body", size: "0.8125rem", weight: 400, lineHeight: 1.5, letterSpacing: "0em", usage: "Figure descriptions and source annotations." },
  { name: "supporting", family: "body", size: "0.875rem", weight: 400, lineHeight: 1.6, letterSpacing: "0em", usage: "Help text and context; retain adequate contrast." },
  { name: "data", family: "body", size: "1rem", weight: 600, lineHeight: 1.5, letterSpacing: "0em", usage: "Aligned numerical values with tabular lining figures; label units and missing data." },
];

export const typographyHeadings = [
  { id: "typefaces", title: "Approved font pairing" },
  { id: "type-scale", title: "Approved type scale" },
  { id: "responsive-type", title: "Responsive behaviour" },
  { id: "text-hierarchy", title: "Text hierarchy" },
  { id: "readability", title: "Readability and accessibility" },
  { id: "type-usage", title: "Appropriate usage" },
  { id: "implementation", title: "Implementation" },
] as const;

// Reference calculations for this specification's rem/vw formulas, not a CSS parser.
export function typographySizeAt(size: string, viewport: number, rootSize = 16) {
  const length = (expression: string) => [...expression.matchAll(/([\d.]+)(rem|vw)/g)].reduce((sum, [, value, unit]) => sum + Number(value) * (unit === "rem" ? rootSize : viewport / 100), 0);
  if (!size.startsWith("clamp(")) return length(size);
  const [min, preferred, max] = size.slice(6, -1).split(",").map(length);
  return Math.max(min, Math.min(preferred, max));
}

export function typographyDeclarations(token: TypographyToken) {
  return `font-family: var(--type-${token.name}-family);\nfont-size: var(--type-${token.name}-size);\nfont-weight: var(--type-${token.name}-weight);\nline-height: var(--type-${token.name}-line-height);\nletter-spacing: var(--type-${token.name}-letter-spacing);${token.name === "data" ? '\nfont-variant-numeric: tabular-nums lining-nums;' : ''}`;
}

export function generatedTypographyCss() {
  return `/* Generated from src/lib/typography-system.ts. Metrics Approved. */\n:root {\n${Object.entries(fontFamilies).map(([name, value]) => `  --font-${name}: ${value};`).join("\n")}\n${typographyTokens.map((token) => `  --type-${token.name}-family: var(--font-${token.family});\n  --type-${token.name}-size: ${token.size};\n  --type-${token.name}-weight: ${token.weight};\n  --type-${token.name}-line-height: ${token.lineHeight};\n  --type-${token.name}-letter-spacing: ${token.letterSpacing};`).join("\n")}\n}\n${typographyTokens.map((token) => `.type-${token.name} {\n  ${typographyDeclarations(token).replaceAll("\n", "\n  ")}\n}`).join("\n")}\n`;
}
