import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
export const metadata: Metadata = { alternates: { canonical: "/terms-of-use/" } };
export default function TermsOfUse() { return <LegalPage slug="terms-of-use"/>; }
