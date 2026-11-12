"use client";

import Link from "@/components/ui/site-link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { PolarisLogo } from "@/components/brand/polaris-logo";
import s from "@/styles/website.module.css";

export const navigation = [{ href: "/", label: "Home" }, { href: "/our-thinking", label: "Our Thinking" }, { href: "/home-leadership-kit", label: "Home Leadership Kit" }, { href: "/help-shape-polaris", label: "Help Shape Kyro Learning" }, { href: "/about", label: "About" }];
export function SiteHeader() {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return <header className={s.header} onKeyDown={event => { if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); } }}>
    <div className={s.headerInner}><Link href="/" className={s.logoLink} aria-label="Kyro Learning home" onClick={() => setOpen(false)}><PolarisLogo width={156} /></Link>
      <button ref={toggle} type="button" className={s.menuToggle} aria-expanded={open} aria-controls="site-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}><span aria-hidden="true">{open ? "×" : "☰"}</span></button>
      <nav id="site-navigation" aria-label="Main navigation" className={`${s.navigation} ${open ? s.navOpen : ""}`}>
        {navigation.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</Link>)}
        <Link className={s.headerCta} href="/help-shape-polaris#conversation" onClick={() => setOpen(false)}>Share Your Perspective</Link>
      </nav>
    </div>
  </header>;
}
