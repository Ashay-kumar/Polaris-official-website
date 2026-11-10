import type { HTMLAttributes } from "react";
import styles from "./container.module.css";

export function Container({ size = "standard", className = "", ...props }:
  HTMLAttributes<HTMLDivElement> & { size?: "compact" | "standard" | "wide" }) {
  return <div {...props} className={`${styles.container} ${size === "standard" ? "" : styles[size]} ${className}`} />;
}
