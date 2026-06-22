import { Link } from "@tanstack/react-router";
import type { Journey } from "../data/mock";

export function JourneyTile({
  journey,
  completed = false,
}: {
  journey: Journey;
  completed?: boolean;
}) {
  return (
    <Link
      to="/journey/$id"
      params={{ id: journey.id }}
      className="flex w-20 shrink-0 flex-col items-center gap-1"
    >
      <div
        className={
          "rounded-full p-[2.5px] " +
          (completed
            ? "bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500"
            : "bg-neutral-200")
        }
      >
        <div className="rounded-full bg-white p-[2px]">
          <img
            src={journey.cover}
            alt=""
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
      </div>
      <span className="w-20 truncate text-center text-[11px] text-neutral-800">
        {journey.title}
      </span>
      {completed ? (
        <span className="rounded-full bg-amber-100 px-1.5 text-[9px] font-semibold uppercase text-amber-800">
          Completed
        </span>
      ) : null}
    </Link>
  );
}