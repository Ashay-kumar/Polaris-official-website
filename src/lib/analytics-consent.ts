/** Basic consent mode: Google resources exist only after explicit acceptance. */
export const CONSENT_KEY = "kyro.analytics-consent";
export const CONSENT_VERSION = 1;
export const CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;
export const MEASUREMENT_ID = "G-85B0Q7PSX8";
export type Choice = "loading" | "undecided" | "granted" | "denied";
type ConsentRecord = { version: number; choice: "granted" | "denied"; timestamp: number };
type AnalyticsWindow = Window & { gtag?: (...args: unknown[]) => void; "ga-disable-G-85B0Q7PSX8"?: boolean };
const pages: { [key: string]: string } = {
  "/": "Kyro Learning", "/our-thinking/": "Our Thinking", "/about/": "About Kyro Learning",
  "/help-shape-polaris/": "Help Shape Kyro Learning", "/home-leadership-kit/": "Home Leadership Kit",
  "/privacy-policy/": "Privacy Policy", "/cookie-policy/": "Cookie Policy", "/terms-of-use/": "Terms of Use",
};
let choice: Choice = "loading", record: ConsentRecord | null = null;
let frame: HTMLIFrameElement | null = null, ready = false, lastPage = "", currentPage = "/";
let expiry: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
export function parseConsent(raw: string | null, now = Date.now()): ConsentRecord | null {
  try {
    const value = JSON.parse(raw ?? "null");
    if (!value || value.version !== CONSENT_VERSION || !["granted", "denied"].includes(value.choice) ||
      !Number.isSafeInteger(value.timestamp) || value.timestamp <= 0 || value.timestamp > now || now - value.timestamp >= CONSENT_LIFETIME) return null;
    return { version: value.version, choice: value.choice, timestamp: value.timestamp };
  } catch { return null; }
}
function read(): ConsentRecord | null { try { return parseConsent(localStorage.getItem(CONSENT_KEY)); } catch { return null; } }
export const getConsent = () => choice;
export const serverConsent = (): Choice => "loading";
export function subscribeConsent(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
const adsDenied = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
function clearCookies() {
  const domains = ["", ...location.hostname.split(".").map((_, i, parts) => parts.slice(i).join(".")).flatMap(d => [d, "." + d])];
  const paths = new Set(["/", ...location.pathname.split("/").map((_, i, parts) => parts.slice(0, i + 1).join("/") || "/")]);
  for (const item of document.cookie.split(";")) {
    const name = item.trim().split("=")[0];
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) continue;
    for (const domain of domains) for (const cookiePath of paths) {
      document.cookie = name + "=; Max-Age=0; path=" + cookiePath + (domain ? "; domain=" + domain : "") + "; SameSite=Lax";
    }
  }
}
function stop() {
  if (frame) {
    const win = frame.contentWindow as AnalyticsWindow | null;
    if (win) {
      win["ga-disable-G-85B0Q7PSX8"] = true;
      win.gtag?.("consent", "update", { ...adsDenied, analytics_storage: "denied" });
    }
    frame.remove(); frame = null;
  }
  ready = false; lastPage = ""; clearCookies();
}
function sendPage() {
  if (choice !== "granted" || !record || Date.now() - record.timestamp >= CONSENT_LIFETIME) { if (choice === "granted") apply(null); return; }
  if (!ready || !frame || !pages[currentPage] || currentPage === lastPage) return;
  const win = frame.contentWindow as AnalyticsWindow | null;
  const page = { page_location: "https://kyrolearning.com" + currentPage, page_title: pages[currentPage], page_referrer: "" };
  win?.gtag?.("set", page);
  win?.gtag?.("event", "page_view", { send_to: MEASUREMENT_ID, ...page });
  lastPage = currentPage;
}
export function visitPage(pathname: string) {
  currentPage = pathname === "/" ? "/" : pathname.replace(/\/$/, "") + "/";
  if (choice !== "granted") return;
  if (!Object.hasOwn(pages, currentPage)) { stop(); return; }
  if (!frame) start();
  sendPage();
}
function start() {
  if (frame || choice !== "granted" || !Object.hasOwn(pages, currentPage)) return;
  const element = document.createElement("iframe");
  element.hidden = true; element.title = "Optional website analytics";
  element.setAttribute("aria-hidden", "true"); element.tabIndex = -1;
  element.referrerPolicy = "no-referrer";
  // The empty document keeps automatic measurement away from forms, links and SPA history.
  element.setAttribute("sandbox", "allow-scripts allow-same-origin");
  // A real same-origin document is required: Google's tag does not reliably collect from srcdoc.
  element.src = "/analytics-frame.html";
  element.onload = () => {
    if (frame !== element || choice !== "granted") return;
    const win = element.contentWindow as AnalyticsWindow | null;
    const doc = element.contentDocument;
    if (!win?.gtag || !doc) return;
    win.gtag("consent", "default", { ...adsDenied, analytics_storage: "denied" });
    win.gtag("set", "ads_data_redaction", true);
    // Destination initialization can precede stream config: queue global defaults first.
    const settings = { send_page_view: false,
      page_location: "https://kyrolearning.com" + currentPage, page_title: pages[currentPage], page_referrer: "",
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_expires: CONSENT_LIFETIME / 1000, cookie_update: false };
    // The served tag initializes on gtm.init, before stream config is consumed.
    // Set documented global defaults first, including automatic-page-view suppression.
    for (const [key, value] of Object.entries(settings)) win.gtag("set", key, value);
    win.gtag("consent", "update", { ...adsDenied, analytics_storage: "granted" });
    win.gtag("js", new Date());
    win.gtag("config", MEASUREMENT_ID, settings);
    const script = doc.createElement("script");
    script.async = true; script.referrerPolicy = "no-referrer";
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
    script.onload = () => { if (frame === element && choice === "granted") { ready = true; sendPage(); } };
    doc.head.append(script);
  };
  frame = element; document.body.append(element);
}
function apply(next: ConsentRecord | null) {
  record = next; choice = next?.choice ?? "undecided";
  clearTimeout(expiry);
  if (choice === "granted") visitPage(location.pathname); else stop();
  if (next) expiry = setTimeout(refresh, Math.min(2147483647, Math.max(1, next.timestamp + CONSENT_LIFETIME - Date.now())));
  listeners.forEach(listener => listener());
}
function refresh() { apply(read()); }
export function initializeConsent() {
  refresh();
  const storage = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === null) refresh(); };
  const visible = () => { if (document.visibilityState === "visible") refresh(); };
  window.addEventListener("storage", storage); window.addEventListener("pageshow", refresh);
  document.addEventListener("visibilitychange", visible);
  return () => { window.removeEventListener("storage", storage); window.removeEventListener("pageshow", refresh); document.removeEventListener("visibilitychange", visible); };
}
export function saveConsent(value: "granted" | "denied"): boolean {
  const next: ConsentRecord = { version: CONSENT_VERSION, choice: value, timestamp: Date.now() };
  // Disable synchronously before storage or React can delay withdrawal.
  if (value === "denied") stop();
  let saved = true;
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(next)); } catch { saved = false; }
  apply(next); return saved;
}
