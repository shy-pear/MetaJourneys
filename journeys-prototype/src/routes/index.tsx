import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "../components/PhoneFrame";
import { TopBar } from "../components/TopBar";
import { BottomTabs } from "../components/BottomTabs";
import { StoriesRow } from "../components/StoriesRow";
import { FriendPostCard } from "../components/PostCard";
import { RampUpCard } from "../components/RampUpCard";
import { JourneyPostCard } from "../components/JourneyPostCard";
import { useApp } from "../state/AppState";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Glimpse" },
      { name: "description", content: "Glimpse — share the journey, not just the highlights." },
      { property: "og:title", content: "Glimpse" },
      { property: "og:description", content: "Glimpse — share the journey, not just the highlights." },
    ],
  }),
  component: Index,
});

function Index() {
  const { journeys, rampUpDismissed, isFollowing, isOwned, getJourney } = useApp();
  // Feed should never show the current user's own journeys — only others'.
  const sourdough = getJourney("sourdough");
  const asia = getJourney("asia");
  const otherFollowed = journeys.filter(
    (j) => !isOwned(j.id) && isFollowing(j.id) && j.id !== "sourdough" && j.id !== "asia",
  );
  return (
    <PhoneFrame>
      <TopBar />
      <main className="flex-1 overflow-y-auto">
        <StoriesRow />
        <FriendPostCard />
        {sourdough && !isOwned(sourdough.id) ? (
          rampUpDismissed || isFollowing("sourdough") ? (
            <JourneyPostCard journey={sourdough} post={sourdough.posts[0]} />
          ) : (
            <RampUpCard journey={sourdough} />
          )
        ) : null}
        {asia && !isOwned(asia.id) && isFollowing("asia") ? (
          <JourneyPostCard journey={asia} post={asia.posts[0]} />
        ) : null}
        {otherFollowed.map((j) => (
          <JourneyPostCard key={j.id} journey={j} post={j.posts[0]} />
        ))}
      </main>
      <BottomTabs />
    </PhoneFrame>
  );
}
