import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Image as ImageIcon, Sparkles, Film, X } from "lucide-react";
import { PhoneFrame } from "../components/PhoneFrame";
import { TopBar } from "../components/TopBar";
import { BottomTabs } from "../components/BottomTabs";
import { getLastMainRoute } from "../lib/nav";

export const Route = createFileRoute("/create/")({
  component: CreatePage,
});

function CreatePage() {
  const navigate = useNavigate();
  return (
    <PhoneFrame>
      <TopBar title="Create" />
      <main className="flex-1 overflow-y-auto p-4">
        <button
          onClick={() => navigate({ to: getLastMainRoute() })}
          className="mb-2 ml-auto block text-xs text-neutral-500"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-semibold">What do you want to create?</h2>
        <p className="text-sm text-neutral-600">
          Capture a moment, or commit to something bigger.
        </p>
        <div className="mt-5 grid gap-3">
          <Link
            to="/create/journey"
            className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-4"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">Start a Journey</div>
              <p className="text-xs text-neutral-600">
                Document a goal over time. Friends can follow along.
              </p>
            </div>
          </Link>
          <button className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-4 text-left">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-neutral-100">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">New Post</div>
              <p className="text-xs text-neutral-600">A single photo or video.</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-4 text-left">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-neutral-100">
              <Film className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">New Reel</div>
              <p className="text-xs text-neutral-600">A short, looping clip.</p>
            </div>
          </button>
        </div>
      </main>
      <BottomTabs />
    </PhoneFrame>
  );
}