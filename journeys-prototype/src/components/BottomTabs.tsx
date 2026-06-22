import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, PlusSquare, Clapperboard, User } from "lucide-react";
import { useEffect } from "react";
import { rememberMainRoute } from "../lib/nav";

export function BottomTabs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    rememberMainRoute(path);
  }, [path]);
  const items = [
    { to: "/", icon: Home, match: (p: string) => p === "/" },
    { to: "/explore", icon: Search, match: (p: string) => p.startsWith("/explore") },
    { to: "/create", icon: PlusSquare, match: (p: string) => p.startsWith("/create") },
    { to: "/reels", icon: Clapperboard, match: (p: string) => p.startsWith("/reels") },
    { to: "/profile", icon: User, match: (p: string) => p.startsWith("/profile") },
  ] as const;
  return (
    <nav className="sticky bottom-0 z-30 mt-auto flex shrink-0 items-center justify-around border-t border-neutral-200 bg-white px-2 pb-[calc(0.625rem+env(safe-area-inset-bottom))] pt-2.5">
      {items.map(({ to, icon: Icon, match }) => {
        const active = match(path);
        return (
          <Link key={to} to={to} className="px-3 py-1">
            <Icon
              className={"h-6 w-6 " + (active ? "text-neutral-900" : "text-neutral-500")}
              strokeWidth={active ? 2.2 : 1.7}
              fill={active && Icon === Home ? "currentColor" : "none"}
            />
          </Link>
        );
      })}
    </nav>
  );
}