import type { Icon } from "@phosphor-icons/react";

export const iconSizes = [16, 20, 24, 32] as const;
export const iconDefaults = { size: 24, weight: "regular", tone: "primary" } as const;
const tones = {
  primary: "var(--color-text-primary)",
  secondary: "var(--color-text-secondary)",
  link: "var(--color-text-link)",
  inverse: "var(--color-text-inverse)",
  inherit: "inherit",
} as const;

type AccessibleIcon = { decorative?: true; label?: never } | { decorative: false; label: string };
export type PolarisIconProps = AccessibleIcon & {
  icon: Icon;
  size?: (typeof iconSizes)[number];
  weight?: "regular" | "fill" | "duotone";
  tone?: keyof typeof tones;
  mirrored?: boolean;
};

/** Import the individual SSR icon at the call site; this adapter owns no catalogue. */
export function PolarisIcon({ icon: Artwork, size = iconDefaults.size, weight = iconDefaults.weight, tone = iconDefaults.tone, mirrored = false, ...name }: PolarisIconProps) {
  const decorative = name.decorative !== false;
  return <Artwork size={size} weight={weight} mirrored={mirrored} color="currentColor"
    style={{ color: tones[tone], flexShrink: 0, verticalAlign: "middle" }}
    focusable="false" aria-hidden={decorative ? true : undefined}
    role={decorative ? undefined : "img"} aria-label={decorative ? undefined : name.label} />;
}
