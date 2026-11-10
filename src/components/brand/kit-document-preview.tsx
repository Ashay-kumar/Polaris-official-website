import { publicPath } from "@/lib/public-path";
import Image from "next/image";
import { kitDownload } from "@/content/qualities";
import previews from "@/content/kit-previews.json";
import s from "./kit-document-preview.module.css";

const labels = { 1: "The guide", 2: "Communication activities", 6: "Four-week tracker" };
export function KitDocumentPreview({ page = 1, caption = true, priority = false }: { page?: 1 | 2 | 6; caption?: boolean; priority?: boolean }) {
  const image = previews[page];
  return <figure className={s.document}><a href={`${publicPath(kitDownload)}#page=${page}`} aria-label={`Open original kit PDF, page ${page}: ${labels[page]}`}><Image src={publicPath(image.src)} width={image.width} height={image.height} alt={`Actual page ${page} of the Home Leadership Kit: ${labels[page]}`} sizes="(max-width: 600px) 230px, 300px" priority={priority} /></a>{caption && <figcaption>Page {page} · {labels[page]}<span>From the original six-page PDF</span></figcaption>}</figure>;
}
