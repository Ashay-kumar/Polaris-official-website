"use client";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { publicPath } from "@/lib/public-path";
type Props = Omit<ComponentProps<typeof NextLink>, "href"> & { href: string };
/** Pages has no Next runtime/rewrites. Navigate to exported HTML documents. */
export default function SiteLink({ href, ...props }: Props) {
  return process.env.NEXT_PUBLIC_BASE_PATH
    ? <a {...props} href={publicPath(href)} />
    : <NextLink {...props} href={href} />;
}
