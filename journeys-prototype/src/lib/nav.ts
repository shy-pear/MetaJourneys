const KEY = "lastMainRoute";
const MAIN = ["/", "/explore", "/reels", "/profile"];

export function rememberMainRoute(path: string) {
  if (typeof window === "undefined") return;
  if (MAIN.includes(path)) {
    try {
      window.sessionStorage.setItem(KEY, path);
    } catch {}
  }
}

export function getLastMainRoute(): "/" | "/explore" | "/reels" | "/profile" {
  if (typeof window === "undefined") return "/";
  try {
    const v = window.sessionStorage.getItem(KEY);
    if (v && MAIN.includes(v)) return v as "/";
  } catch {}
  return "/";
}