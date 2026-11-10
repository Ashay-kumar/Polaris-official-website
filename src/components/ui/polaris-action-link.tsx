import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { ActionAppearance } from "./polaris-button";
import "@/styles/polaris-button.css";

/** Native navigation. No disabled/loading fiction or client-side navigation dependency. */
export function PolarisActionLink({ variant = "secondary", size = "medium", fullWidth = false, leadingIcon, trailingIcon, children, className = "", href, ...props }: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & ActionAppearance & { href: string; children: ReactNode }) {
  return <a {...props} href={href} className={`polaris-action polaris-action-${variant} polaris-action-${size}${fullWidth ? " polaris-action-full" : ""} ${className}`}>
    {leadingIcon && <span aria-hidden="true" className="polaris-action-icon">{leadingIcon}</span>}
    <span className="polaris-action-label">{children}</span>
    {trailingIcon && <span aria-hidden="true" className="polaris-action-icon">{trailingIcon}</span>}
  </a>;
}
