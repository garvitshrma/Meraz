// Warms the other scene pages while the visitor is on the home page, so they open from the cache instead of the
// network: their route code first, then their models, one at a time. It waits for the home page to have fully
// loaded (the window's load event; the caller starts it once its own scene is complete), then goes only when the
// browser is idle, at low network priority, so nothing on the page waits on it. Skipped on data-saver and 2G
// connections. The returned function stops it (leaving the page). The 3D itself can't be built ahead: WebGL work
// belongs to the page's own canvas.
import { melaModel } from "@/data/site";

type Connection = { saveData?: boolean; effectiveType?: string };

// What each page needs to show beyond its route: its models, and the pictures it opens on.
export const pageFiles: Record<string, string[]> = {
  "/events": [melaModel],
  "/contact": ["/models/telephone.glb", "/models/stool.glb"],
  "/about": ["/about/street.webp", "/about/wall.webp", "/about/elephant.webp"],
  "/passes": ["/passes/ticket.webp", "/passes/train.webp"],
};

// Fetches a page's route and files now, at full priority (the visitor is on the way there): resolves once its files
// are in the cache, or failed (the page fetches what it lacks itself).
export function preload(href: string, prefetchRoute: (href: string) => void) {
  prefetchRoute(href);
  return Promise.all((pageFiles[href] ?? []).map((url) => fetch(url).then((r) => r.arrayBuffer()))).then(
    () => {},
    () => {},
  );
}

export function warmUp(routes: string[], prefetchRoute: (href: string) => void, files: string[]) {
  const stop = new AbortController();
  const net = (navigator as Navigator & { connection?: Connection }).connection;
  if (net?.saveData || /2g/.test(net?.effectiveType ?? "")) return () => {};
  // Safari has no requestIdleCallback: a short timeout stands in.
  const idleApi = "requestIdleCallback" in window;
  let idle = 0;
  const whenIdle = () =>
    new Promise<void>((go) => {
      idle = idleApi ? requestIdleCallback(() => go(), { timeout: 5000 }) : window.setTimeout(go, 200);
    });

  (async () => {
    if (document.readyState !== "complete") await new Promise((go) => addEventListener("load", go, { once: true, signal: stop.signal }));
    for (const href of routes) {
      await whenIdle();
      if (stop.signal.aborted) return;
      prefetchRoute(href);
    }
    for (const url of files) {
      await whenIdle();
      if (stop.signal.aborted) return;
      // Fetched as the scenes' loaders fetch them (same URL, cors, same-origin credentials), so they share the entry.
      const res = await fetch(url, { priority: "low", signal: stop.signal } as RequestInit);
      await res.arrayBuffer(); // read to the end, so it is cached whole
    }
  })().catch(() => {}); // stopped or offline: each page fetches what it needs itself when opened

  return () => {
    stop.abort();
    if (idleApi) cancelIdleCallback(idle);
    else clearTimeout(idle);
  };
}
