const root = "/brand/logos/v1.1/svg";

export const polarisLogos = {
  primary: { src: `${root}/polaris-logo-primary.svg`, width: 1000, height: 1422 },
  horizontal: { src: `${root}/polaris-logo-horizontal.svg`, width: 1482, height: 454 },
  black: { src: `${root}/polaris-logo-black.svg`, width: 1000, height: 1422 },
  reversed: { src: `${root}/polaris-logo-reversed.svg`, width: 1383, height: 1422 },
  symbol: { src: `${root}/polaris-symbol-primary.svg`, width: 1000, height: 981 },
  icon: { src: `${root}/polaris-icon-primary.svg`, width: 700, height: 700 },
} as const;

export type PolarisLogoVariant = keyof typeof polarisLogos;
