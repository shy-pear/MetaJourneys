import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "../components/PhoneFrame";
import { TopBar } from "../components/TopBar";
import { BottomTabs } from "../components/BottomTabs";
import { JourneyTile } from "../components/JourneyTile";
import { useApp } from "../state/AppState";
import { CURRENT_USER, PROFILE_GRID } from "../data/mock";
import { Grid3x3, Bookmark, UserSquare2, Settings } from "lucide-react";
import { StoryViewer, STORY_SLIDES } from "../components/StoryViewer";

const SUNDAY_RUNS_SLIDES = [
  {
    id: "hl-run-1",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80",
    caption: "Sunday morning run prep! Chasing those therapeutic early miles and crisp fresh air 🏃‍♂️🌅",
    time: "2w ago"
  },
  {
    id: "hl-run-2",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80",
    caption: "Half marathon training milestone! Hit 10 miles with stable pace and zero knee pain. Leveling up!",
    time: "1w ago"
  },
  {
    id: "hl-run-3",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=600&q=80",
    caption: "Leg day recovery hike. Remember to hydrate and stretch out those hard-working muscles! 💧🌳",
    time: "3d ago"
  }
];

const GOLF_SLIDES = [
  {
    id: "g-1",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80",
    caption: "Day 1. Committing publicly so I actually do this and break 100. Let's do this! 🏌️‍♂️",
    time: "4w ago"
  },
  {
    id: "g-2",
    image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=600&q=80",
    caption: "lesson #2 — apparently my grip was upside down 🙃 New wedges in hand!",
    time: "2w ago"
  },
  {
    id: "g-3",
    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=600&q=80",
    caption: "shot a 108 today. one stroke closer to my target checkpoint!",
    time: "3d ago"
  }
];

const MARATHON_SLIDES = [
  {
    id: "m-1",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    caption: "Day 1. I cannot currently run 1 mile. Goal: 26.2. Training program starts now.",
    time: "9w ago"
  },
  {
    id: "m-2",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80",
    caption: "hit week 6 of 16. trail miles >>> treadmill miles. haven't quit yet!",
    time: "4w ago"
  },
  {
    id: "m-3",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80",
    caption: "first 10-miler in the books! Legs are absolutely jelly, let's keep going. 🏆",
    time: "2d ago"
  }
];

const BABY_SLIDES = [
  {
    id: "b-1",
    image: "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80",
    caption: "tummy time champion, she discovered her reflection in the mirror! Cute!",
    time: "2m ago"
  },
  {
    id: "b-2",
    image: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=600&q=80",
    caption: "nap strike day 4. send coffee or strong hot espresso immediately ☕️",
    time: "1m ago"
  },
  {
    id: "b-3",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80",
    caption: "month 5: she discovered her feet! Unbelievable milestone 👶❤️",
    time: "2d ago"
  }
];

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · Glimpse" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { journeys, isOwned, isCompleted, highlights } = useApp();
  const owned = journeys.filter((j) => isOwned(j.id));

  // Highlight player state
  const [viewingHighlight, setViewingHighlight] = useState<{
    id: string;
    name: string;
    slides: { id: string; image: string; caption: string; time: string }[];
    initialTitle?: string;
    initialDesc?: string;
    initialStage?: string;
    initialTheme?: string;
  } | null>(null);

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

        {/* 1. Journeys Section (Small Bar above Highlights) */}
        <section className="mt-5 px-4">
          <div className="mb-2 flex items-center justify-end">
            <Link to="/create/journey" className="text-xs font-semibold text-blue-600 hover:underline">
              + New Journey
            </Link>
          </div>
          
          {owned.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {owned.map((j) => (
                <Link
                  key={j.id}
                  to={`/journey/${j.id}` as any}
                  className="flex items-center gap-3 shrink-0 rounded-xl bg-neutral-50/50 border border-neutral-200/80 p-2.5 w-[210px] hover:bg-neutral-50 hover:border-neutral-300 transition"
                >
                  <img
                    src={j.cover}
                    alt=""
                    className="h-11 w-11 rounded-lg object-cover bg-neutral-100 border border-neutral-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] font-extrabold text-teal-600 uppercase tracking-widest font-mono">
                        Active
                      </span>
                      {isCompleted(j.id) && (
                        <span className="bg-amber-100 text-amber-800 px-1 py-0.5 text-[8px] font-bold rounded">
                          Done
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-neutral-800 truncate mt-0.5 leading-tight">{j.title}</h3>
                    <p className="text-[10px] text-neutral-500 truncate mt-0.5 leading-none">{j.stage}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 2. Highlights Section (Circles below Journeys) */}
        {highlights && highlights.length > 0 && (
          <section className="mt-4 px-4 border-t border-neutral-100 pt-4">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {highlights.map((hl) => (
                <div 
                  key={hl.id} 
                  onClick={() => {
                    if (hl.id === "hl-run") {
                      setViewingHighlight({
                        id: hl.id,
                        name: hl.name,
                        slides: SUNDAY_RUNS_SLIDES,
                        initialTitle: "Sunday Run Routine",
                        initialDesc: "Documenting my weekly Sunday run routine, trail explores, and training milestones.",
                        initialStage: "Phase 2 · Half marathon prep 🏃‍♂️",
                        initialTheme: "Sports & Fitness"
                      });
                    } else if (hl.id === "hl-golf") {
                      setViewingHighlight({
                        id: hl.id,
                        name: hl.name,
                        slides: GOLF_SLIDES,
                        initialTitle: "🏌️ Break 100",
                        initialDesc: "Committing publicly so I actually do this. Goal: break 100 by July.",
                        initialStage: "Lesson #2 completed!",
                        initialTheme: "Sports & Fitness"
                      });
                    } else if (hl.id === "hl-marathon") {
                      setViewingHighlight({
                        id: hl.id,
                        name: hl.name,
                        slides: MARATHON_SLIDES,
                        initialTitle: "🏃‍♂️ Couch to Marathon",
                        initialDesc: "16 weeks. 26.2 miles. No prior running experience. Send help.",
                        initialStage: "Week 9 of 16 in progress!",
                        initialTheme: "Sports & Fitness"
                      });
                    } else if (hl.id === "hl-baby") {
                      setViewingHighlight({
                        id: hl.id,
                        name: hl.name,
                        slides: BABY_SLIDES,
                        initialTitle: "👶 First Baby June",
                        initialDesc: "Documenting the months with our daughter June. The good, the wild, the sleepless.",
                        initialStage: "Month 5 discovered feet! 🦶",
                        initialTheme: "Parenting & Family"
                      });
                    } else {
                      // Custom highlight
                      setViewingHighlight({
                        id: hl.id,
                        name: hl.name,
                        slides: STORY_SLIDES,
                        initialTitle: hl.name,
                        initialDesc: "Restoring an old 1980s steel frame into a vintage celestial blue commuter bike. Step-by-step updates!",
                        initialStage: "Week 1 · base coat prepped! 🎨",
                        initialTheme: "Hobby & Maker"
                      });
                    }
                  }}
                  className="flex flex-col items-center shrink-0 gap-1.5 cursor-pointer group"
                >
                  <div className="h-14 w-14 rounded-full border-2 border-neutral-200 bg-white p-[2px] shadow-sm group-hover:border-neutral-400 group-active:scale-95 transition">
                    <img
                      src={hl.cover}
                      alt={hl.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-medium text-neutral-600 max-w-[64px] truncate text-center">
                    {hl.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

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

      {viewingHighlight && (
        <StoryViewer
          onClose={() => setViewingHighlight(null)}
          onNavigateToJourney={(journeyId) => {
            navigate({ to: `/journey/${journeyId}` });
          }}
          slides={viewingHighlight.slides}
          isHighlightMode={true}
          highlightName={viewingHighlight.name}
          highlightId={viewingHighlight.id}
          initialJourneyTitle={viewingHighlight.initialTitle}
          initialJourneyDesc={viewingHighlight.initialDesc}
          initialJourneyStage={viewingHighlight.initialStage}
          initialJourneyTheme={viewingHighlight.initialTheme}
        />
      )}
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