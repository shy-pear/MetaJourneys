import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "../components/PhoneFrame";
import { TopBar } from "../components/TopBar";
import { Composer } from "../components/Composer";
import { BackButton } from "../components/BackButton";
import { useApp } from "../state/AppState";
import { CURRENT_USER, type Journey } from "../data/mock";

export const Route = createFileRoute("/create/journey/first-post")({
  head: () => ({ meta: [{ title: "First post · Glimpse" }] }),
  component: FirstPostPage,
});

function FirstPostPage() {
  const navigate = useNavigate();
  const { createJourney } = useApp();

  return (
    <PhoneFrame>
      <TopBar title="Make your first post" />
      <div className="border-b border-neutral-200 bg-white px-3 py-2">
        <BackButton onClick={() => navigate({ to: "/create/journey" })} />
      </div>
      <main className="flex-1 overflow-y-auto">
        <Composer
          ctaLabel="Post & start journey"
          onPost={(post) => {
            const draft = JSON.parse(sessionStorage.getItem("draftJourney") || "null");
            if (!draft) {
              navigate({ to: "/create/journey" });
              return;
            }
            const journey: Journey = {
              id: draft.id,
              title: draft.title,
              description: draft.description,
              theme: draft.theme,
              stage: "Day 1",
              followers: 0,
              startDate: new Date().toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              timeline: draft.timeline?.trim() || "ongoing",
              cover: draft.cover,
              owner: CURRENT_USER.username,
              ownerAvatar: CURRENT_USER.avatar,
              posts: [post],
            };
            createJourney(journey);
            sessionStorage.removeItem("draftJourney");
            navigate({ to: "/profile" });
          }}
        />
      </main>
    </PhoneFrame>
  );
}