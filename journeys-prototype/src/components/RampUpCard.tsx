import { useApp } from "../state/AppState";
import type { Journey } from "../data/mock";

export function RampUpCard({ journey }: { journey: Journey }) {
  const { followJourney, dismissRampUp } = useApp();
  return (
    <div className="border-b border-neutral-200">
      <div className="m-3 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50">
        <div className="flex gap-3 p-3">
          <img
            src={journey.cover}
            alt=""
            className="h-20 w-20 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug text-neutral-900">
              <span className="font-semibold">{journey.owner}</span> has been ramping up
              their <span className="font-semibold">{journey.theme}</span> journey
            </p>
            <p className="mt-0.5 text-xs text-neutral-600">{journey.stage}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-amber-200/60 bg-white/60 px-3 py-2">
          <span className="text-xs text-neutral-700">Follow along?</span>
          <button
            onClick={() => {
              followJourney(journey.id);
              dismissRampUp();
            }}
            className="rounded-full bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white"
          >
            Follow along
          </button>
        </div>
      </div>
    </div>
  );
}