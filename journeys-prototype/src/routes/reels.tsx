import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, Send, Music2, Sparkles } from "lucide-react";
import { PhoneFrame } from "../components/PhoneFrame";
import { BottomTabs } from "../components/BottomTabs";
import { MetaAIPanel } from "../components/MetaAIPanel";

export const Route = createFileRoute("/reels")({
  component: ReelsPage,
});

type Reel = {
  id: string;
  username: string;
  caption: string;
  song: string;
  poster: string;
  video: string;
  topic: string;
  topicLabel: string;
  intro: string;
  likes: string;
  comments: string;
};

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const REELS: Reel[] = [
  {
    id: "r1",
    username: "@coach.delaney",
    caption: "3 drills to fix your slice in under 10 minutes 🏌️",
    song: "original audio · coach.delaney",
    poster: u("photo-1593111774240-d529f12cf4bb"),
    video:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    topic: "golf",
    topicLabel: "golf",
    intro:
      "Just starting out with golf? Here are beginner-friendly drills, creators, and gear picks to get you swinging with confidence.",
    likes: "12.4k",
    comments: "284",
  },
  {
    id: "r2",
    username: "@pastry.with.poppy",
    caption: "My first sourdough loaf vs my 30th 🍞 keep going!",
    song: "warm kitchen — lo-fi loops",
    poster: u("photo-1509440159596-0249088772ff"),
    video:
      "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
    topic: "cooking",
    topicLabel: "baking",
    intro:
      "Looks like you're curious about baking. Here are beginner resources, a starter community, and the kit most home bakers swear by.",
    likes: "8.1k",
    comments: "192",
  },
  {
    id: "r3",
    username: "@erika.hits.greens",
    caption: "Reading greens for beginners — pick your line in 5 seconds ⛳",
    song: "original audio · erika.hits.greens",
    poster: u("photo-1535131749006-b7f58c99034b"),
    video:
      "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4",
    topic: "golf",
    topicLabel: "golf",
    intro:
      "New to reading greens? Here are short, beginner-level resources curated to help you build a putting routine you trust.",
    likes: "3.7k",
    comments: "76",
  },
];

function ReelsPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Reel | null>(null);
  return (
    <PhoneFrame>
      <main className="relative flex flex-1 snap-y snap-mandatory flex-col overflow-y-auto bg-black text-white">
        {REELS.map((r) => (
          <section
            key={r.id}
            className="relative flex h-full min-h-full w-full shrink-0 snap-start snap-always items-end"
          >
            <video
              src={r.video}
              poster={r.poster}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />

            {/* Try this CTA */}
            <button
              onClick={() => setActive(r)}
              className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-md backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              Want to try this?
            </button>

            {/* Right rail actions */}
            <div className="absolute right-3 bottom-24 z-10 flex flex-col items-center gap-4">
              <button className="flex flex-col items-center">
                <Heart className="h-7 w-7" />
                <span className="text-[11px] font-semibold">{r.likes}</span>
              </button>
              <button className="flex flex-col items-center">
                <MessageCircle className="h-7 w-7" />
                <span className="text-[11px] font-semibold">{r.comments}</span>
              </button>
              <button className="flex flex-col items-center">
                <Send className="h-6 w-6" />
              </button>
            </div>

            {/* Caption */}
            <div className="relative z-10 w-full px-4 pb-6 pr-20">
              <div className="text-sm font-semibold">{r.username}</div>
              <p className="mt-1 text-sm leading-snug">{r.caption}</p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] opacity-90">
                <Music2 className="h-3 w-3" />
                <span className="truncate">{r.song}</span>
              </div>
            </div>
          </section>
        ))}
      </main>
      {active ? (
        <MetaAIPanel
          topic={active.topicLabel}
          intro={active.intro}
          onClose={() => setActive(null)}
          onStartJourney={() => navigate({ to: "/create/journey" })}
          startJourneyLabel={`Start a ${active.topicLabel} journey`}
        />
      ) : null}
      <BottomTabs />
    </PhoneFrame>
  );
}