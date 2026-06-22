import { Link } from "@tanstack/react-router";
import { Aperture } from "lucide-react";

export function TopBar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur">
      <Link to="/" className="flex items-center gap-2">
        <Aperture className="h-6 w-6 text-neutral-900" strokeWidth={1.6} />
        {title ? (
          <span className="text-base font-semibold text-neutral-900">{title}</span>
        ) : (
          <span
            className="text-2xl leading-none text-neutral-900"
            style={{ fontFamily: "'Grand Hotel', cursive" }}
          >
            Glimpse
          </span>
        )}
      </Link>
      <div className="h-6 w-6" aria-hidden="true" />
    </header>
  );
}