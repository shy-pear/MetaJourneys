import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "../components/PhoneFrame";
import { TopBar } from "../components/TopBar";
import { Composer } from "../components/Composer";
import { BackButton } from "../components/BackButton";
import { useApp } from "../state/AppState";

export const Route = createFileRoute("/journey/$id/add")({
  head: () => ({ meta: [{ title: "Add update · Glimpse" }] }),
  component: AddUpdatePage,
});

function AddUpdatePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { addPost, getJourney } = useApp();
  const j = getJourney(id);

  return (
    <PhoneFrame>
      <TopBar title={j ? `Add to "${j.title}"` : "Add update"} />
      <div className="flex items-center gap-2 border-b border-neutral-200 bg-white px-3 py-2">
        <BackButton onClick={() => navigate({ to: `/journey/${id}` })} />
      </div>
      <main className="flex-1 overflow-y-auto">
        <Composer
          ctaLabel="Post update"
          journeyId={id}
          initialStage={j?.stage}
          onPost={(post) => {
            addPost(id, post);
            navigate({ to: `/journey/${id}/posted` });
          }}
        />
      </main>
    </PhoneFrame>
  );
}
