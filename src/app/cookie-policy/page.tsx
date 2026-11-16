import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
export const metadata: Metadata = { alternates: { canonical: "/cookie-policy/" } };
export default function CookiePolicy() { return <LegalPage slug="cookie-policy"/>; }
