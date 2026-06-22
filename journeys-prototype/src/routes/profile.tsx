import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "../components/PhoneFrame";
import { TopBar } from "../components/TopBar";
import { BottomTabs } from "../components/BottomTabs";
import { JourneyTile } from "../components/JourneyTile";
import { useApp } from "../state/AppState";
import { CURRENT_USER, PROFILE_GRID } from "../data/mock";
import { Grid3x3, Bookmark, UserSquare2, Settings } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · Glimpse" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { journeys, isOwned, isCompleted } = useApp();
  const owned = journeys.filter((j) => isOwned(j.id));
  return (
    <PhoneFrame>
      <TopBar title={CURRENT_USER.username} />
      <main className="flex-1 overflow-y-auto">
        <section className="px-4 pt-4">
          <div className="flex items-center gap-5">
            <img
              src={CURRENT_USER.avatar}
              alt=""
              className="h-20 w-20 rounded-full object-cover"
            />
            <div className="grid flex-1 grid-cols-3 text-center">
              <Stat n={CURRENT_USER.posts} label="posts" />
              <Stat n={CURRENT_USER.followers} label="followers" />
              <Stat n={CURRENT_USER.following} label="following" />
            </div>
          </div>
          <h1 className="mt-3 text-sm font-semibold">{CURRENT_USER.displayName}</h1>
          <p className="text-sm text-neutral-700">{CURRENT_USER.bio}</p>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 rounded-lg bg-neutral-100 py-1.5 text-sm font-semibold">
              Edit Profile
            </button>
            <button className="flex-1 rounded-lg bg-neutral-100 py-1.5 text-sm font-semibold">
              Share Profile
            </button>
            <button className="rounded-lg bg-neutral-100 px-2.5">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="mt-5 px-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold">Journeys</h2>
            <Link to="/create/journey" className="text-xs font-semibold text-blue-600">
              + New
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {owned.map((j) => (
              <JourneyTile key={j.id} journey={j} completed={isCompleted(j.id)} />
            ))}
          </div>
        </section>

        <div className="mt-3 flex border-t border-neutral-200">
          <div className="flex flex-1 items-center justify-center border-t-2 border-neutral-900 py-2">
            <Grid3x3 className="h-5 w-5" />
          </div>
          <div className="flex flex-1 items-center justify-center py-2 text-neutral-400">
            <Bookmark className="h-5 w-5" />
          </div>
          <div className="flex flex-1 items-center justify-center py-2 text-neutral-400">
            <UserSquare2 className="h-5 w-5" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          {PROFILE_GRID.map((p) => (
            <img
              key={p.id}
              src={p.url}
              alt=""
              className="aspect-square w-full object-cover"
            />
          ))}
        </div>
      </main>
      <BottomTabs />
    </PhoneFrame>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div className="text-base font-semibold">{n.toLocaleString()}</div>
      <div className="text-xs text-neutral-600">{label}</div>
    </div>
  );
}