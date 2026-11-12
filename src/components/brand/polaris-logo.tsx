import { publicPath } from "@/lib/public-path";
import Image from "next/image";
import { polarisLogos, type PolarisLogoVariant } from "@/lib/brand/logos";

type Props = {
  variant?: PolarisLogoVariant;
  alt?: string;
  className?: string;
  width?: number;
};

/** Preserve the complete approved canvas. Reversed artwork needs a dark surface. */
export function PolarisLogo({ variant = "horizontal", alt = "Kyro Learning", className, width }: Props) {
  const asset = polarisLogos[variant];
  const displayWidth = width ?? asset.width;
  return <Image src={publicPath(asset.src)} alt={alt} width={displayWidth}
    height={displayWidth * asset.height / asset.width} className={className}
    style={{ height: "auto" }} unoptimized />;
}
