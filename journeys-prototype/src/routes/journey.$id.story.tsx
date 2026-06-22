import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useApp } from "../state/AppState";
import { X } from "lucide-react";
import { PhoneFrame } from "../components/PhoneFrame";
import { getLastMainRoute } from "../lib/nav";

export const Route = createFileRoute("/journey/$id/story")({
  component: StoryViewer,
});

function StoryViewer() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { getJourney } = useApp();
  const j = getJourney(id);
  const [i, setI] = useState(0);
  const posts = j ? [...j.posts].reverse() : [];

  useEffect(() => {
    if (!posts.length) return;
    const t = setTimeout(() => {
      if (i < posts.length - 1) setI(i + 1);
      else navigate({ to: "/journey/$id", params: { id } });
    }, 4500);
    return () => clearTimeout(t);
  }, [i, posts.length, id, navigate]);

  if (!j) return null;
  const p = posts[i];

  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col bg-black text-white">
      <div className="flex gap-1 px-3 pt-3">
        {posts.map((_, k) => (
          <div key={k} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
            <div
              className={
                "h-full bg-white " +
                (k < i ? "w-full" : k === i ? "w-full animate-[grow_4.5s_linear]" : "w-0")
              }
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <img src={j.ownerAvatar} alt="" className="h-7 w-7 rounded-full object-cover" />
          <span className="text-sm font-semibold">{j.title}</span>
        </div>
        <button onClick={() => navigate({ to: getLastMainRoute() })}>
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="relative flex-1">
        <div
          className="absolute inset-y-0 left-0 z-10 w-1/3"
          onClick={() => setI(Math.max(0, i - 1))}
        />
        <div
          className="absolute inset-y-0 right-0 z-10 w-2/3"
          onClick={() =>
            i < posts.length - 1
              ? setI(i + 1)
              : navigate({ to: "/journey/$id", params: { id } })
          }
        />
        {p.type === "video" && p.url ? (
          <video
            key={p.id}
            src={p.url}
            poster={p.poster}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-contain"
          />
        ) : p.type === "photo" && p.url ? (
          <img src={p.url} alt="" className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500 to-rose-500 px-8 text-center text-xl font-semibold">
            {p.caption}
          </div>
        )}
        {p.type !== "text" ? (
          <p className="absolute bottom-6 left-4 right-4 z-0 rounded-lg bg-black/40 p-3 text-sm">
            {p.caption}
          </p>
        ) : null}
      </div>
      </div>
    </PhoneFrame>
  );
}