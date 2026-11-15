import { publicPath } from "@/lib/public-path";
import Image from "next/image";
import type { CSSProperties } from "react";
import { polarisLogos, type PolarisLogoVariant } from "@/lib/brand/logos";
import s from "./polaris-logo.module.css";

type Props = {
  variant?: PolarisLogoVariant;
  alt?: string;
  className?: string;
  width?: number;
};

/** Original assets stay untouched. Horizontal framing removes transparent canvas only. */
export function PolarisLogo({ variant = "horizontal", alt = "Kyro Learning", className, width }: Props) {
  const asset = polarisLogos[variant];
  const displayWidth = width ?? asset.width;
  if (variant === "horizontal") {
    return <span className={`${s.horizontalFrame} ${className ?? ""}`} data-logo-frame="horizontal"
      style={{ "--logo-width": `${displayWidth}px` } as CSSProperties}>
      <Image src={publicPath(asset.src)} alt={alt} width={asset.width} height={asset.height}
        className={s.horizontalImage} unoptimized />
    </span>;
  }
  return <Image src={publicPath(asset.src)} alt={alt} width={displayWidth}
    height={displayWidth * asset.height / asset.width} className={className}
    style={{ height: "auto" }} unoptimized />;
}
