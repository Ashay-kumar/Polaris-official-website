const root = "/brand/logos/v2.0/svg";

export const polarisLogos = {
  primary: { src: `${root}/kyro-learning-logo-primary.svg`, width: 1253, height: 1575 },
  horizontal: { src: `${root}/kyro-learning-logo-horizontal.svg`, width: 1982, height: 794 },
  black: { src: `${root}/kyro-learning-logo-ink.svg`, width: 1000, height: 1680 },
  reversed: { src: `${root}/kyro-learning-logo-reversed-backed.svg`, width: 1383, height: 1680 },
  symbol: { src: `/brand/logos/v1.1/svg/polaris-symbol-primary.svg`, width: 1000, height: 981 },
  icon: { src: `/brand/logos/v1.1/svg/polaris-icon-primary.svg`, width: 700, height: 700 },
} as const;

export type PolarisLogoVariant = keyof typeof polarisLogos;
