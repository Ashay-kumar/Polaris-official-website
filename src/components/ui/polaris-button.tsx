"use client";

import { useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { createActionGate, type buttonSizes, type buttonVariants } from "@/lib/brand/button-system";
import "@/styles/polaris-button.css";

export type ActionAppearance = {
  variant?: (typeof buttonVariants)[number];
  size?: (typeof buttonSizes)[number];
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};
type ButtonName = { iconOnly: true; "aria-label": string; children: ReactNode } | { iconOnly?: false; children: ReactNode; "aria-label"?: string };
export type PolarisButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> & ActionAppearance & ButtonName & {
  loading?: boolean;
  loadingLabel?: string;
  /** Promise-returning actions are guarded; errors must be surfaced by the owner. */
  onAction?: () => void | Promise<void>;
};

export function PolarisButton({ variant = "primary", size = "medium", fullWidth = false, leadingIcon, trailingIcon, iconOnly = false, children, type = "button", disabled = false, loading = false, loadingLabel = "Working…", onAction, onClick, className = "", ...props }: PolarisButtonProps) {
  const gate = useRef(createActionGate());
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState("");
  const busy = loading || pending;
  if (iconOnly && !props["aria-label"]?.trim()) throw new Error("Icon-only buttons require a non-empty aria-label.");
  return <span className={`polaris-action-wrap${fullWidth ? " polaris-action-wrap-full" : ""}`}>
    <button {...props} type={type} disabled={disabled || busy} aria-busy={busy || undefined}
      className={`polaris-action polaris-action-${variant} polaris-action-${size}${fullWidth ? " polaris-action-full" : ""}${iconOnly ? " polaris-action-icon-only" : ""} ${className}`}
      onClick={event => {
        if (disabled || busy || gate.current.pending) { event.preventDefault(); return; }
        onClick?.(event);
        if (event.defaultPrevented || !onAction) return;
        // onAction owns an async command, not native form submission.
        event.preventDefault();
        setFailure("");
        setPending(true);
        void gate.current.run(onAction).catch(() => setFailure("Action could not be completed. Try again.")).finally(() => setPending(false));
      }}>
      {leadingIcon && <span aria-hidden="true" className="polaris-action-icon">{leadingIcon}</span>}
      <span className="polaris-action-label">{children}</span>
      {trailingIcon && <span aria-hidden="true" className="polaris-action-icon">{trailingIcon}</span>}
      {busy && <span className="polaris-action-progress" aria-hidden="true">…</span>}
    </button>
    <span className="polaris-action-announcement" role="status" aria-live="polite" aria-atomic="true">{busy ? loadingLabel : ""}</span>
    {failure && <span role="alert" className="polaris-action-error">{failure}</span>}
  </span>;
}
