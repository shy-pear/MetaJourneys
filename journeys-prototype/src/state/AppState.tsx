import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { JOURNEYS, type Journey, type Post } from "../data/mock";

type Ctx = {
  journeys: Journey[];
  followedJourneyIds: Set<string>;
  followedUsernames: Set<string>;
  ownedJourneyIds: Set<string>;
  completedJourneyIds: Set<string>;
  rampUpDismissed: boolean;
  highlights: { id: string; name: string; cover: string }[];
  followJourney: (id: string) => void;
  unfollowJourney: (id: string) => void;
  toggleFollow: (id: string) => void;
  toggleFollowUser: (username: string) => void;
  dismissRampUp: () => void;
  addPost: (journeyId: string, post: Post) => void;
  createJourney: (j: Journey) => void;
  completeJourney: (id: string, highlight?: { images: string[]; caption: string }) => void;
  deleteJourney: (id: string) => void;
  isFollowing: (id: string) => boolean;
  isFollowingUser: (username: string) => boolean;
  isOwned: (id: string) => boolean;
  isCompleted: (id: string) => boolean;
  getJourney: (id: string) => Journey | undefined;
  addHighlight: (id: string, name: string, cover: string) => void;
  deleteHighlight: (id: string) => void;
  updateStage: (id: string, stage: string) => void;
};

const AppCtx = createContext<Ctx | null>(null);

const LS_KEY = "glimpse.appstate.v2";
const DEFAULT_JOURNEY_IDS = new Set(JOURNEYS.map((j) => j.id));

function loadPersisted(): {
  followed?: string[];
  followedUsers?: string[];
  owned?: string[];
  completed?: string[];
  customJourneys?: Journey[];
  rampUpDismissed?: boolean;
  highlights?: { id: string; name: string; cover: string }[];
} | null {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
  }
  return null; // Force state to reset on every page refresh/reload as requested
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const persisted = loadPersisted();
  const [journeys, setJourneys] = useState<Journey[]>(() =>
    [
      ...(persisted?.customJourneys ?? []),
      ...JOURNEYS.map((j) => ({ ...j, posts: [...j.posts] })),
    ],
  );
  // pre-follow "asia" so a journey post from another user is visible in the feed on first load
  const [followed, setFollowed] = useState<Set<string>>(
    () => new Set(persisted?.followed ?? ["asia"]),
  );
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(
    () => new Set(persisted?.followedUsers ?? []),
  );
  const [owned, setOwned] = useState<Set<string>>(
    () => new Set(persisted?.owned ?? []),
  );
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(persisted?.completed ?? []),
  );
  const [rampUpDismissed, setRampUpDismissed] = useState(
    persisted?.rampUpDismissed ?? false,
  );
  const [highlights, setHighlights] = useState<{ id: string; name: string; cover: string }[]>(() => {
    return persisted?.highlights ?? [
      {
        id: "hl-golf",
        name: "🏌️ Break 100",
        cover: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=200&h=200&q=80",
      },
      {
        id: "hl-marathon",
        name: "🏃‍♂️ Marathon",
        cover: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=200&h=200&q=80",
      },
      {
        id: "hl-baby",
        name: "👶 First Baby",
        cover: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=200&h=200&q=80",
      },
      {
        id: "hl-run",
        name: "🏃‍♂️ Sunday Runs",
        cover: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=200&h=200&q=80",
      },
    ];
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          followed: Array.from(followed),
          followedUsers: Array.from(followedUsers),
          owned: Array.from(owned),
          completed: Array.from(completed),
          customJourneys: journeys.filter((j: Journey) => !DEFAULT_JOURNEY_IDS.has(j.id)),
          rampUpDismissed,
          highlights,
        }),
      );
    } catch {
      // ignore quota / privacy errors
    }
  }, [journeys, followed, followedUsers, owned, completed, rampUpDismissed, highlights]);

  const value = useMemo<Ctx>(
    () => ({
      journeys,
      followedJourneyIds: followed,
      followedUsernames: followedUsers,
      ownedJourneyIds: owned,
      completedJourneyIds: completed,
      rampUpDismissed,
      highlights,
      followJourney: (id: string) =>
        setFollowed((s: Set<string>) => {
          const n = new Set(s);
          n.add(id);
          return n;
        }),
      unfollowJourney: (id: string) =>
        setFollowed((s: Set<string>) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        }),
      toggleFollow: (id: string) =>
        setFollowed((s: Set<string>) => {
          const n = new Set(s);
          if (n.has(id)) n.delete(id);
          else n.add(id);
          return n;
        }),
      toggleFollowUser: (username: string) =>
        setFollowedUsers((s: Set<string>) => {
          const n = new Set(s);
          if (n.has(username)) n.delete(username);
          else n.add(username);
          return n;
        }),
      dismissRampUp: () => setRampUpDismissed(true),
      addPost: (journeyId: string, post: Post) =>
        setJourneys((js: Journey[]) =>
          js.map((j: Journey) =>
            j.id === journeyId ? { ...j, posts: [post, ...j.posts] } : j,
          ),
        ),
      createJourney: (j: Journey) => {
        setJourneys((js: Journey[]) => [j, ...js]);
        setOwned((s: Set<string>) => {
          const n = new Set(s);
          n.add(j.id);
          return n;
        });
      },
      completeJourney: (id: string, highlight?: { images: string[]; caption: string }) => {
        if (highlight) {
          setJourneys((js: Journey[]) =>
            js.map((j: Journey) => (j.id === id ? { ...j, highlight } : j)),
          );
        }
        setCompleted((s: Set<string>) => {
          const n = new Set(s);
          n.add(id);
          return n;
        });
      },
      deleteJourney: (id: string) => {
        setJourneys((js: Journey[]) => js.filter((j: Journey) => j.id !== id));
        setOwned((s: Set<string>) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        });
        setFollowed((s: Set<string>) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        });
        setCompleted((s: Set<string>) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        });
      },
      isFollowing: (id: string) => followed.has(id),
      isFollowingUser: (username: string) => followedUsers.has(username),
      isOwned: (id: string) => owned.has(id),
      isCompleted: (id: string) => completed.has(id),
      getJourney: (id: string) => journeys.find((j: Journey) => j.id === id),
      addHighlight: (id: string, name: string, cover: string) => {
        setHighlights((prev) => {
          if (prev.some((h) => h.id === id)) return prev;
          return [...prev, { id, name, cover }];
        });
      },
      deleteHighlight: (id: string) => {
        setHighlights((prev) => prev.filter((h) => h.id !== id));
      },
      updateStage: (id: string, stage: string) => {
        setJourneys((js: Journey[]) =>
          js.map((j: Journey) => (j.id === id ? { ...j, stage } : j)),
        );
      },
    }),
    [journeys, followed, followedUsers, owned, completed, rampUpDismissed, highlights],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside AppStateProvider");
  return c;
}
