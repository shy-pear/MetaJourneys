import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "../components/PhoneFrame";
import { TopBar } from "../components/TopBar";
import { BottomTabs } from "../components/BottomTabs";
import { JourneyProgressCard } from "../components/JourneyProgressCard";
import { CURRENT_USER, EXPLORE_GRID } from "../data/mock";
import { useApp } from "../state/AppState";
import { Search, Play } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "Explore · Glimpse" }] }),
  component: ExplorePage,
});

const TABS = ["For You", "Journeys", "Reels", "Accounts"] as const;

function ExplorePage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<(typeof TABS)[number]>("For You");
  const { journeys } = useApp();

  const ql = q.trim().toLowerCase();
  const grid = ql
    ? EXPLORE_GRID.filter((g) => g.tags.some((t) => t.includes(ql)))
    : EXPLORE_GRID;

  const visibleJourneys = journeys.filter(
    (j) => j.owner !== CURRENT_USER.username,
  );
  const filteredJourneys = ql
    ? visibleJourneys.filter(
        (j) =>
          j.title.toLowerCase().includes(ql) ||
          j.theme.toLowerCase().includes(ql) ||
          j.description.toLowerCase().includes(ql),
      )
    : visibleJourneys;

  return (
    <PhoneFrame>
      <TopBar title="Explore" />
      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-neutral-200 px-3 py-2">
          <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2">
            <Search className="h-4 w-4 text-neutral-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={
                  "shrink-0 rounded-full px-3 py-1 text-xs font-semibold " +
                  (tab === t
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-700")
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === "Journeys" ? (
          <div className="grid gap-3 p-3">
            {filteredJourneys.length === 0 ? (
              <p className="py-10 text-center text-sm text-neutral-500">
                No journeys found for "{q}"
              </p>
            ) : (
              filteredJourneys.map((j) => (
                <JourneyProgressCard key={j.id} journey={j} />
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {grid.map((g) => (
              <div key={g.id} className="relative">
                <img
                  src={g.url}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
                {g.video ? (
                  <Play className="absolute right-1 top-1 h-4 w-4 fill-white text-white drop-shadow" />
                ) : null}
              </div>
            ))}
            {grid.length === 0 ? (
              <p className="col-span-3 py-10 text-center text-sm text-neutral-500">
                No results for "{q}"
              </p>
            ) : null}
          </div>
        )}
      </main>
      <BottomTabs />
    </PhoneFrame>
  );
}