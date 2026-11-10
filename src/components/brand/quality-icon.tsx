import { ChatCircleIcon } from "@phosphor-icons/react/dist/ssr/ChatCircle";
import { FlagIcon } from "@phosphor-icons/react/dist/ssr/Flag";
import { LightbulbIcon } from "@phosphor-icons/react/dist/ssr/Lightbulb";
import { PlantIcon } from "@phosphor-icons/react/dist/ssr/Plant";
import { PolarisIcon } from "./polaris-icon";
import type { QualityId } from "@/content/qualities";

const icons = { communication: ChatCircleIcon, leadership: FlagIcon, curiosity: LightbulbIcon, resilience: PlantIcon };
export function QualityIcon({ quality, size = 32 }: { quality: QualityId; size?: 16 | 20 | 24 | 32 }) {
  return <PolarisIcon icon={icons[quality]} size={size} />;
}
