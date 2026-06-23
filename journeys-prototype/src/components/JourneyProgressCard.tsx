import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import type { Journey } from "../data/mock";
import { useApp } from "../state/AppState";

export function JourneyProgressCard({ journey }: { journey: Journey; key?: any }) {
  const { isFollowing, toggleFollow } = useApp();
  const following = isFollowing(journey.id);
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <Link to={`/journey/${journey.id}` as any}>
        <img src={journey.cover} alt="" className="aspect-[16/9] w-full object-cover" />
      </Link>
      <div className="p-3">
        <div className="mb-2 flex items-center gap-2">
          <img
            src={journey.ownerAvatar}
            alt=""
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="flex-1 truncate text-xs font-semibold text-neutral-900">
            @{journey.owner}
          </span>
          <button
            onClick={() => toggleFollow(journey.id)}
            className={
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold " +
              (following
                ? "border border-neutral-300 bg-white text-neutral-700"
                : "bg-sky-600 text-white")
            }
          >
            {following ? "Following" : "Follow"}
          </button>
        </div>
        <Link to={`/journey/${journey.id}` as any}>
          <h3 className="text-sm font-semibold text-neutral-900">{journey.title}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-neutral-600">
          {journey.stage} · {journey.followers} following along
        </p>
        <button
          onClick={() => toggleFollow(journey.id)}
          className={
            "mt-3 inline-flex w-full items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold " +
            (following
              ? "border border-neutral-300 bg-white text-neutral-900"
              : "bg-neutral-900 text-white")
          }
        >
          {following ? (
            <>
              <Check className="h-3.5 w-3.5" /> Following
            </>
          ) : (
            "Follow along"
          )}
        </button>
      </div>
    </div>
  );
}