export const buttonHeadings = [
  { id: "button-overview", title: "Overview and anatomy" },
  { id: "button-variants", title: "Variants and sizes" },
  { id: "button-interaction", title: "Interactive examples" },
  { id: "button-states", title: "States and accessibility" },
  { id: "button-guidance", title: "Usage and responsive behaviour" },
  { id: "button-api", title: "Implementation and API" },
] as const;
export const buttonVariants = ["primary", "secondary", "tertiary", "destructive"] as const;
export const buttonSizes = ["small", "medium", "large"] as const;
// Component aliases only. No foundation colour, type or spacing value is changed.
export const buttonTokens = {
  "--button-secondary-pressed-background": "var(--color-surface-selected)",
  "--button-tertiary-text": "var(--color-text-link)",
  "--button-tertiary-background": "var(--color-surface-primary)",
  "--button-tertiary-hover-background": "var(--color-action-secondary-hover)",
  "--button-tertiary-pressed-background": "var(--color-surface-selected)",
  "--button-danger-background": "var(--color-feedback-error-text)",
  "--button-danger-text": "var(--color-text-inverse)",
  "--button-height-small": "calc(var(--space-1) * 9)",
  "--button-height-medium": "calc(var(--space-1) * 11)",
  "--button-height-large": "var(--space-12)",
} as const;
export function generatedButtonCss() {
  return `/* Generated from src/lib/button-system.ts. Button specifications Approved. */\n:root {\n${Object.entries(buttonTokens).map(([name, value]) => `  ${name}: ${value};`).join("\n")}\n}\n`;
}

export const buttonContrastPairs = [
  ...["primary", "secondary", "tertiary"].flatMap(variant => ["default", "hover", "pressed"].map(state => ({
    label: `${variant} ${state} label/icon`,
    foreground: variant === "primary" ? "--button-primary-text" : variant === "secondary" ? "--button-secondary-text" : "--button-tertiary-text",
    background: state === "default" ? `--button-${variant}-background` : `--button-${variant}-${state}-background`, threshold: 4.5,
  }))),
  { label: "Destructive default/hover/pressed label and inset indicator", foreground: "--button-danger-text", background: "--button-danger-background", threshold: 4.5 },
  { label: "Loading label/icon", foreground: "--color-text-primary", background: "--color-surface-secondary", threshold: 4.5 },
  { label: "Disabled label (inactive-control exemption)", foreground: "--button-disabled-text", background: "--button-disabled-background", threshold: 0 },
  ...["--color-surface-primary", "--color-surface-page", "--color-surface-secondary"].map(background => ({ label: `Action failure message on ${background}`, foreground: "--color-feedback-error-text", background, threshold: 4.5 })),
  ...["--button-secondary-background", "--button-secondary-hover-background", "--button-secondary-pressed-background", "--button-disabled-background", "--color-surface-secondary"].map(background => ({ label: `Strong boundary on ${background}`, foreground: "--color-border-strong", background, threshold: 3 })),
  ...["--color-surface-primary", "--color-surface-page", "--color-surface-secondary"].flatMap(background => ["--control-focus-ring", "--button-primary-background", "--button-primary-hover-background", "--button-primary-pressed-background", "--button-danger-background", "--button-secondary-border"].map(foreground => ({ label: `${foreground} against supported ${background}`, foreground, background, threshold: 3 }))),
] as const;

/** Locks before invoking the action, including before React can render pending state. */
export function createActionGate() {
  let pending = false;
  return {
    get pending() { return pending; },
    async run(action: () => void | Promise<void>) {
      if (pending) return;
      pending = true;
      try { await action(); } finally { pending = false; }
    },
  };
}
