/** Canonical colour source. Derived specifications are Approved. No runtime dependency. */
export const brandColours = {
  blue: { name: "Royal Blue", hex: "#245CFF", legacy: "--polaris-blue" },
  pink: { name: "Raspberry Pink", hex: "#E93C8D", legacy: "--raspberry-pink" },
  lime: { name: "Electric Lime", hex: "#C8EE56", legacy: "--electric-lime" },
  peach: { name: "Soft Peach", hex: "#FFB78A", legacy: "--soft-peach" },
  neutral: { name: "Deep Ink", hex: "#19253D", legacy: "--deep-ink" },
  ivory: { name: "Warm Ivory", hex: "#FFFDF7", legacy: "--warm-ivory" },
} as const;
export type ColourFamily = keyof typeof brandColours;
export type ColourLayer = "brand" | "tonal" | "utility" | "semantic" | "component" | "compatibility";
export interface ColourToken { name: string; value: string; layer: ColourLayer; group: string; purpose: string; usage: string; status: "Founder Approved" | "Approved" }
export const toneSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export const lightnessTargets = [0.98, 0.90, 0.82, 0.74, 0.66, 0.58, 0.50, 0.42, 0.34, 0.24] as const;
const decode = (v: number) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
export function rgb(hex: string) { return hex.slice(1).match(/../g)!.map((v) => parseInt(v, 16) / 255); }
export function oklab(hex: string) {
  const [r, g, b] = rgb(hex).map(decode);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function linearRgb(L: number, C: number, h: number) {
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
function fromLch(L: number, C: number, h: number) {
  const inGamut = (c: number) => linearRgb(L, c, h).every((v) => v >= 0 && v <= 1);
  if (!inGamut(C)) {
    let low = 0, high = C;
    for (let i = 0; i < 24; i++) { const middle = (low + high) / 2; if (inGamut(middle)) low = middle; else high = middle; }
    C = low;
  }
  return "#" + linearRgb(L, C, h).map((v) => Math.round(255 * Math.min(1, Math.max(0, v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)))).map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export const colourTokens: ColourToken[] = [];
function add(name: string, value: string, layer: ColourLayer, group: string, purpose: string, usage = purpose, status: ColourToken["status"] = "Approved") {
  colourTokens.push({ name, value, layer, group, purpose, usage, status });
}
export const scaleAnchors: Record<string, number> = {};
for (const [family, brand] of Object.entries(brandColours)) {
  const brandName = `--color-brand-${family === "neutral" ? "ink" : family}`;
  add(brandName, brand.hex, "brand", family, brand.name, "Immutable founder-approved brand primitive; not an automatic text or status colour.", "Founder Approved");
  const [L, a, b] = oklab(brand.hex), C = Math.hypot(a, b), h = Math.atan2(b, a);
  const anchorIndex = lightnessTargets.reduce<number>((best, target, i) => Math.abs(target - L) < Math.abs(lightnessTargets[best] - L) ? i : best, 0);
  scaleAnchors[family] = toneSteps[anchorIndex];
  toneSteps.forEach((step, i) => {
    const target = lightnessTargets[i];
    const chroma = C * Math.min(target / L, (1 - target) / (1 - L));
    add(`--color-${family}-${step}`, i === anchorIndex ? brandName : fromLch(target, chroma, h), "tonal", family, `${brand.name} ${step}${i === anchorIndex ? " · approved anchor reference" : ""}`, i === anchorIndex ? "Exact reference to the approved base; scale position is a documented technical mapping." : "Approved tonal primitive; use semantic roles in product code.");
  });
}
// Utility colours are implementation values, not additional brand colours.
for (const [name, hex, purpose] of [
  ["white", "#FFFDF7", "Compatibility utility: Warm Ivory surface and inverse text"], ["page", "#FFFDF7", "Warm Ivory page surface"],
  ["warm-neutral", "#F7F5EF", "Quiet warm neutral surface derivative"], ["muted", "#58636A", "Existing readable muted text"],
  ["divider", "#DEDFD7", "Existing decorative divider"], ["functional-blue", "#1A40B5", "Functional Royal Blue derivative for links and focus"],
  ["functional-pink", "#B52368", "Darker Raspberry derivative for readable accent text"],
  ["functional-green", "#376653", "Retained functional positive-data utility; not a brand base"],
  ["success-foreground", "#285840", "Reviewed candidate for completed system operations"], ["success-surface", "#E5EEE6", "Quiet success surface"],
  ["warning-foreground", "#77501C", "Existing review/attention text"], ["warning-surface", "#FBEFDA", "Existing review/attention surface"],
  ["error-foreground", "#8B3D31", "Candidate error/critical-operation text"], ["error-surface", "#F6E8E5", "Quiet error surface"],
] as const) add(`--color-${name}`, hex, "utility", "functional", purpose);

const roles: Record<string, [string, string, string][]> = {
  text: [
    ["primary", "brand-ink", "Primary reading text on light surfaces"], ["secondary", "neutral-700", "Supporting text with clear hierarchy"],
    ["muted", "muted", "Readable metadata; never use opacity to weaken essential text"], ["inverse", "white", "Text on the inverse Deep Ink surface"],
    ["disabled", "neutral-500", "Inactive controls only; not a label for missing information"], ["link", "functional-blue", "Underline links in running text"], ["link-hover", "blue-800", "Hover text; preserve underline and focus indication"],
  ],
  surface: [
    ["page", "page", "Overall page canvas"], ["primary", "white", "Default content surface"], ["secondary", "warm-neutral", "Neutral supporting panels"],
    ["subtle", "neutral-50", "Quiet nested grouping"], ["elevated", "white", "Overlay surface; elevation needs layout/border cues too"],
    ["inverse", "brand-ink", "Dark presentation surface with inverse text"], ["selected", "blue-100", "Selection fill paired with a strong indicator and a label"],
  ],
  border: [
    ["default", "divider", "Decorative separators only; not an essential control outline"], ["subtle", "neutral-100", "Decorative grouping only"],
    ["strong", "neutral-600", "Essential control boundary on documented light surfaces"], ["focus", "functional-blue", "Focus outline on documented light surfaces"],
    ["focus-inverse", "white", "Focus outline on inverse surfaces"], ["error", "error-foreground", "Error outline accompanied by an error message"],
  ],
  action: [
    ["primary", "brand-blue", "Primary filled action with inverse text"], ["primary-hover", "blue-800", "Primary hover with inverse text"],
    ["primary-pressed", "blue-900", "Primary pressed with inverse text"], ["secondary", "white", "Secondary background; use link text and a strong outline"],
    ["secondary-hover", "blue-50", "Secondary hover; keep text and boundary"], ["disabled", "neutral-100", "Inactive action surface; apply a real disabled state"],
  ],
  data: [
    ["positive", "functional-green", "Positive change label/mark; never rank a child"], ["attention", "warning-foreground", "Needs attention, with a label and evidence"],
    ["critical", "error-foreground", "Critical system/data condition, not a developmental diagnosis"], ["neutral", "muted", "Contextual datum with a visible value"],
    ["missing", "muted", "Unavailable data; show an explicit missing label, not zero"],
  ],
};
for (const [group, entries] of Object.entries(roles)) for (const [role, ref, purpose] of entries) add(`--color-${group}-${role}`, `--color-${ref}`, "semantic", group, purpose);
for (const [state, fg, bg] of [["success", "success-foreground", "success-surface"], ["warning", "warning-foreground", "warning-surface"], ["error", "error-foreground", "error-surface"], ["information", "functional-blue", "blue-50"]]) {
  for (const [part, ref] of [["text", fg], ["surface", bg], ["border", fg]]) add(`--color-feedback-${state}-${part}`, `--color-${ref}`, "semantic", "feedback", `${state} ${part}`, "For system feedback, with a textual status and icon/shape; not a score or identity for a child.");
}
for (const [name, ref] of [
  ["button-primary-background", "--color-action-primary"], ["button-primary-text", "--color-text-inverse"],
  ["button-primary-hover-background", "--color-action-primary-hover"], ["button-primary-pressed-background", "--color-action-primary-pressed"],
  ["button-secondary-background", "--color-action-secondary"], ["button-secondary-hover-background", "--color-action-secondary-hover"],
  ["button-secondary-text", "--color-text-link"], ["button-secondary-border", "--color-border-strong"],
  ["button-disabled-background", "--color-action-disabled"], ["button-disabled-text", "--color-text-disabled"],
  ["control-focus-ring", "--color-border-focus"], ["control-focus-ring-inverse", "--color-border-focus-inverse"],
  ["navigation-selected-background", "--color-surface-selected"], ["navigation-selected-text", "--color-text-link"], ["navigation-selected-indicator", "--color-border-focus"],
] as const) add(`--${name}`, ref, "component", "states", name.replaceAll("-", " "), "Illustrative component-state mapping, not a production component specification.");

// Compatibility names remain available; their semantic roles follow Curious Pop.
for (const [family, brand] of Object.entries(brandColours)) add(brand.legacy, `--color-brand-${family === "neutral" ? "ink" : family}`, "compatibility", "legacy", "Existing brand variable");
for (const [name, ref] of [
  ["forest-green", "functional-green"], ["sunrise-gold", "brand-peach"], ["blush", "brand-peach"],
  ["background", "surface-page"], ["surface", "surface-secondary"], ["text", "text-primary"], ["text-muted", "text-muted"],
  ["border", "border-default"], ["action-blue", "functional-blue"], ["text-green", "functional-pink"], ["link", "text-link"],
  ["focus", "border-focus"], ["review-surface", "warning-surface"], ["review-text", "warning-foreground"],
] as const) add(`--${name}`, `--color-${ref}`, "compatibility", "legacy", "Compatibility name; preserves the role rather than the old palette");

const registry = new Map(colourTokens.map((token) => [token.name, token]));
export function resolveColour(name: string, visited = new Set<string>()): string {
  if (/^#[\da-f]{6}$/i.test(name)) return name;
  if (visited.has(name)) throw new Error(`Circular colour alias: ${name}`);
  const token = registry.get(name);
  if (!token) throw new Error(`Unknown colour token: ${name}`);
  return resolveColour(token.value, new Set([...visited, name]));
}
export function contrast(foreground: string, background: string) {
  const luminance = (token: string) => { const [r, g, b] = rgb(resolveColour(token)).map(decode); return r * 0.2126 + g * 0.7152 + b * 0.0722; };
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
export interface ContrastCase { label: string; foreground: string; background: string; threshold: number; expected: "pass" | "fail" | "exempt"; note: string }
export const contrastCases: ContrastCase[] = [];
function check(label: string, foreground: string, background: string, threshold = 4.5, expected: ContrastCase["expected"] = "pass", note = "Opaque sRGB pair only; other surfaces need testing.") { contrastCases.push({ label, foreground, background, threshold, expected, note }); }
for (const text of ["primary", "secondary", "muted", "link", "link-hover"]) for (const surface of ["page", "primary", "secondary", "subtle", "elevated", "selected"]) check(`${text} text / ${surface}`, `--color-text-${text}`, `--color-surface-${surface}`);
check("Inverse text", "--color-text-inverse", "--color-surface-inverse");
for (const state of ["primary", "primary-hover", "primary-pressed"]) {
  check(`${state} action text`, "--color-text-inverse", `--color-action-${state}`);
  check(`${state} action boundary`, `--color-action-${state}`, "--color-surface-page", 3);
}
for (const surface of ["secondary", "secondary-hover"]) check(`${surface} action text`, "--button-secondary-text", `--color-action-${surface}`);
for (const surface of ["secondary", "secondary-hover"]) check(`${surface} action outline`, "--button-secondary-border", `--color-action-${surface}`, 3);
for (const surface of ["page", "primary", "secondary", "subtle", "selected"]) {
  check(`Focus / ${surface}`, "--color-border-focus", `--color-surface-${surface}`, 3);
  check(`Strong boundary / ${surface}`, "--color-border-strong", `--color-surface-${surface}`, 3);
}
check("Inverse focus", "--color-border-focus-inverse", "--color-surface-inverse", 3);
check("Error outline", "--color-border-error", "--color-surface-primary", 3);
check("Selected navigation text", "--navigation-selected-text", "--navigation-selected-background");
for (const state of ["success", "warning", "error", "information"]) {
  check(`${state} feedback text`, `--color-feedback-${state}-text`, `--color-feedback-${state}-surface`);
  check(`${state} feedback boundary`, `--color-feedback-${state}-border`, `--color-feedback-${state}-surface`, 3);
}
for (const role of ["positive", "attention", "critical", "neutral", "missing"]) {
  check(`${role} data mark`, `--color-data-${role}`, "--color-surface-primary", 3);
  check(`${role} data label on specimen`, `--color-data-${role}`, "--color-surface-secondary");
}
check("Disabled action text", "--button-disabled-text", "--button-disabled-background", 4.5, "exempt", "Inactive UI is exempt from these contrast thresholds. Never use this pairing for active controls or readable body content.");
for (const foreground of ["--color-brand-pink", "--color-brand-lime", "--color-brand-peach"]) check("Accent / Ivory: " + foreground, foreground, "--color-brand-ivory", 4.5, "fail", "Use Ink on Lime/Peach; use functional Pink text on Ivory. Base accents remain exact.");
check("Ink / Pink normal text", "--color-brand-ink", "--color-brand-pink", 4.5, "fail", "Use a separate Ivory label surface for normal text.");
check("Blue indicator / Ink", "--color-brand-blue", "--color-brand-ink", 3, "fail", "Use the inverse Ivory indicator on Ink.");
check("Decorative divider as sole boundary", "--color-border-default", "--color-surface-primary", 3, "fail", "Use a strong essential boundary.");
check("Selected fill as sole indicator", "--color-surface-selected", "--color-surface-primary", 3, "fail", "Keep the indicator, label and programmatic state.");
check("Functional Blue focus on inverse", "--color-border-focus", "--color-surface-inverse", 3, "fail", "Use the inverse focus ring.");
check("Ink / Lime", "--color-brand-ink", "--color-brand-lime");
check("Ink / Peach", "--color-brand-ink", "--color-brand-peach");
check("Supporting text / Peach", "--color-text-secondary", "--color-brand-peach");
check("Link / Peach", "--color-text-link", "--color-brand-peach");
check("Functional Pink / Ivory", "--color-functional-pink", "--color-brand-ivory");
check("Ivory / Royal Blue", "--color-brand-ivory", "--color-brand-blue");
check("Large Pink / Ivory", "--color-brand-pink", "--color-brand-ivory", 3, "pass", "Large text only; normal text fails.");
for (const foreground of ["--color-brand-lime", "--color-brand-peach"]) check("Bright essential mark / Ivory: " + foreground, foreground, "--color-brand-ivory", 3, "fail", "Add a strong Ink boundary or use another mark colour.");

export function generatedColourCss() {
  return "/* Generated by npm run tokens:generate. Edit src/lib/colour-system.ts instead. */\n:root {\n" + colourTokens.map((token) => `  /* ${token.layer} | ${token.status} */\n  ${token.name}: ${token.value.startsWith("--") ? `var(${token.value})` : token.value};`).join("\n") + "\n}\n";
}
