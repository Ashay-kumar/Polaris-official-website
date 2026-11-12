import { publicPath } from "@/lib/public-path";
import Image from "next/image";
import { kitDownload } from "@/content/qualities";
import previews from "@/content/kit-previews.json";
import s from "./kit-document-preview.module.css";

const labels = {
  1: "The Home Leadership Kit",
  3: "Communication activities",
  7: "Four-week tracker",
} as const;

type PreviewPage = keyof typeof labels;

export function KitDocumentPreview({
  page = 1,
  caption = true,
  priority = false,
}: {
  page?: PreviewPage;
  caption?: boolean;
  priority?: boolean;
}) {
  const image = previews[String(page) as keyof typeof previews];

  return (
    <figure className={s.document}>
      <a
        href={`${publicPath(kitDownload)}#page=${page}`}
        aria-label={`Open Kyro Learning Home Leadership Kit, page ${page}: ${labels[page]}`}
      >
        <Image
          src={publicPath(image.src)}
          width={image.width}
          height={image.height}
          alt={`Page ${page} of the Kyro Learning Home Leadership Kit: ${labels[page]}`}
          sizes="(max-width: 600px) 230px, 300px"
          priority={priority}
        />
      </a>

      {caption && (
        <figcaption>
          Page {page} · {labels[page]}
          <span>From the eight-page Kyro Learning kit</span>
        </figcaption>
      )}
    </figure>
  );
}