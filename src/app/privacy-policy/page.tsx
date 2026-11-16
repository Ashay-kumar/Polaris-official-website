import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
export const metadata: Metadata = { alternates: { canonical: "/privacy-policy/" } };
export default function PrivacyPolicy() { return <LegalPage slug="privacy-policy"/>; }
