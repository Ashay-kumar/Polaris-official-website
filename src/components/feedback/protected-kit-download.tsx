"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KitAuthorization } from "@/lib/form-submission";
import s from "./kit-access.module.css";

export function ProtectedKitDownload({ authorization, renew, autoStart = false }: { authorization: KitAuthorization; renew: () => void; autoStart?: boolean }) {
  const [pending, setPending] = useState(false), [downloaded, setDownloaded] = useState(false), [error, setError] = useState("");
  const started = useRef(false), busy = useRef(false);
  const download = useCallback(async () => {
    if (authorization.status !== "ready" || busy.current || downloaded) return;
    if (Date.parse(authorization.expiresAt) <= Date.now()) { setError("Download access expired. Renew access below using the same request."); return; }
    busy.current = true; setPending(true); setError("");
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/api/kit-download", { headers: { Authorization: `Bearer ${authorization.token}` }, signal: controller.signal, cache: "no-store", credentials: "same-origin", redirect: "error" });
      if (!response.ok) throw new Error(response.status === 410 ? "Access expired or was already used. Renew expired access below; contact info@kyrolearning.com if the download was interrupted after use." : "The download could not be completed. Retry the download. Your request has already been saved.");
      if (!response.headers.get("content-type")?.startsWith("application/pdf")) throw new Error("The download could not be verified. Contact info@kyrolearning.com for help.");
      const blob = await response.blob(), url = URL.createObjectURL(blob), link = document.createElement("a");
      link.href = url; link.download = "Kyro_Learning_Home_Leadership_Kit.pdf"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 60000); setDownloaded(true);
    } catch (failure) { const message = failure instanceof Error ? failure.message : ""; setError(/^(Access expired|The download)/.test(message) ? message : "Download unavailable. Retry the download without submitting another request."); }
    finally { clearTimeout(timeout); busy.current = false; setPending(false); }
  }, [authorization, downloaded]);
  useEffect(() => { if (autoStart && !started.current) { started.current = true; void download(); } }, [autoStart, download]);
  if (authorization.status === "redeemed") return <p role="status">This request&apos;s download access has already been used. If you could not save the file, contact <a href="mailto:info@kyrolearning.com">info@kyrolearning.com</a>.</p>;
  return <div><button type="button" className={s.check} disabled={pending || downloaded} onClick={download}>{pending ? "Preparing download…" : downloaded ? "Download started" : "Download your kit"}</button>
    <p role="status">{downloaded ? "Your browser received the file. Save it from your downloads." : "Download access lasts 15 minutes and can be used once."}</p>
    {error && <><p role="alert">{error}</p><button type="button" className={s.check} disabled={pending} onClick={renew}>Renew download access</button></>}
  </div>;
}
