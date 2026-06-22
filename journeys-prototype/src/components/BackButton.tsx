import { ChevronLeft } from "lucide-react";

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-neutral-900 shadow-sm ring-1 ring-neutral-900/10 backdrop-blur transition hover:bg-white"
      aria-label="Back"
    >
      <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
    </button>
  );
}