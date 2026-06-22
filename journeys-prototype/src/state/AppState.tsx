import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { JOURNEYS, type Journey, type Post } from "../data/mock";

type Ctx = {
  journeys: Journey[];
  followedJourneyIds: Set<string>;
  ownedJourneyIds: Set<string>;
  completedJourneyIds: Set<string>;
  rampUpDismissed: boolean;
  followJourney: (id: string) => void;
  unfollowJourney: (id: string) => void;
  toggleFollow: (id: string) => void;
  dismissRampUp: () => void;
  addPost: (journeyId: string, post: Post) => void;
  createJourney: (j: Journey) => void;
  completeJourney: (id: string, highlight?: { images: string[]; caption: string }) => void;
  deleteJourney: (id: string) => void;
  isFollowing: (id: string) => boolean;
  isOwned: (id: string) => boolean;
  isCompleted: (id: string) => boolean;
  getJourney: (id: string) => Journey | undefined;
};

const AppCtx = createContext<Ctx | null>(null);

const LS_KEY = "glimpse.appstate.v2";
const DEFAULT_JOURNEY_IDS = new Set(JOURNEYS.map((j) => j.id));

function loadPersisted() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      followed?: string[];
      owned?: string[];
      completed?: string[];
      customJourneys?: Journey[];
      rampUpDismissed?: boolean;
    };
  } catch {
    return null;
  }
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
  const [owned, setOwned] = useState<Set<string>>(
    () => new Set(persisted?.owned ?? ["golf", "marathon", "baby"]),
  );
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(persisted?.completed ?? []),
  );
  const [rampUpDismissed, setRampUpDismissed] = useState(
    persisted?.rampUpDismissed ?? false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          followed: Array.from(followed),
          owned: Array.from(owned),
          completed: Array.from(completed),
          customJourneys: journeys.filter((j) => !DEFAULT_JOURNEY_IDS.has(j.id)),
          rampUpDismissed,
        }),
      );
    } catch {
      // ignore quota / privacy errors
    }
  }, [journeys, followed, owned, completed, rampUpDismissed]);

  const value = useMemo<Ctx>(
    () => ({
      journeys,
      followedJourneyIds: followed,
      ownedJourneyIds: owned,
      completedJourneyIds: completed,
      rampUpDismissed,
      followJourney: (id) =>
        setFollowed((s) => {
          const n = new Set(s);
          n.add(id);
          return n;
        }),
      unfollowJourney: (id) =>
        setFollowed((s) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        }),
      toggleFollow: (id) =>
        setFollowed((s) => {
          const n = new Set(s);
          if (n.has(id)) n.delete(id);
          else n.add(id);
          return n;
        }),
      dismissRampUp: () => setRampUpDismissed(true),
      addPost: (journeyId, post) =>
        setJourneys((js) =>
          js.map((j) =>
            j.id === journeyId ? { ...j, posts: [post, ...j.posts] } : j,
          ),
        ),
      createJourney: (j) => {
        setJourneys((js) => [j, ...js]);
        setOwned((s) => {
          const n = new Set(s);
          n.add(j.id);
          return n;
        });
      },
      completeJourney: (id, highlight) => {
        if (highlight) {
          setJourneys((js) =>
            js.map((j) => (j.id === id ? { ...j, highlight } : j)),
          );
        }
        setCompleted((s) => {
          const n = new Set(s);
          n.add(id);
          return n;
        });
      },
      deleteJourney: (id) => {
        setJourneys((js) => js.filter((j) => j.id !== id));
        setOwned((s) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        });
        setFollowed((s) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        });
        setCompleted((s) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        });
      },
      isFollowing: (id) => followed.has(id),
      isOwned: (id) => owned.has(id),
      isCompleted: (id) => completed.has(id),
      getJourney: (id) => journeys.find((j) => j.id === id),
    }),
    [journeys, followed, owned, completed, rampUpDismissed],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppStateProvider");
  return ctx;
}