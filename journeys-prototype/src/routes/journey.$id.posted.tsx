import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "../components/PhoneFrame";
import { TopBar } from "../components/TopBar";
import { useApp } from "../state/AppState";
import { Sparkles, Sprout } from "lucide-react";
import { MetaAIPanel } from "../components/MetaAIPanel";

export const Route = createFileRoute("/journey/$id/posted")({
  component: PostedPage,
});

function PostedPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { getJourney } = useApp();
  const j = getJourney(id);
  const [ai, setAi] = useState(false);

  return (
    <PhoneFrame>
      <TopBar title="Posted" />
      <main className="flex flex-1 flex-col items-center px-6 pt-12 pb-16 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-green-100 text-green-700">
          <Sprout className="h-9 w-9" />
        </div>
        <h1 className="mt-5 text-xl font-semibold">Great job!</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Remember, every small step is progress 🌱
        </p>
        <button
          onClick={() => setAi(true)}
          className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
        >
          <Sparkles className="h-4 w-4" /> Need more inspiration?
        </button>
        <button
          onClick={() => navigate({ to: `/journey/${id}` })}
          className="mt-4 text-sm font-semibold text-neutral-700"
        >
          Back to journey
        </button>
      </main>
      {ai ? (
        <MetaAIPanel
          topic={j?.theme ?? "your"}
          stage={j?.stage}
          onClose={() => setAi(false)}
        />
      ) : null}
    </PhoneFrame>
  );
}