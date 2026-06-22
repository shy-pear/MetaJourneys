import { Sparkles, ThumbsUp, ThumbsDown, X, Send } from "lucide-react";
import { useEffect, useState } from "react";

type Section = {
  kind: "Creators" | "Communities" | "Products";
  items: { title: string; sub: string }[];
};

const TOPIC_CONTENT: Record<string, Section[]> = {
  golf: [
    {
      kind: "Creators",
      items: [
        { title: "@coach.delaney", sub: "Short-game drills, 3x/week" },
        { title: "@erika.hits.greens", sub: "Iron play breakdowns" },
      ],
    },
    {
      kind: "Communities",
      items: [
        { title: "r/100breakers", sub: "12.4k members chasing the same goal" },
        { title: "Weekend Range Crew", sub: "Local meetups near you" },
      ],
    },
    {
      kind: "Products",
      items: [
        { title: "Arccos Smart Sensors", sub: "Auto-tracks every shot" },
        { title: "The Stack System", sub: "Speed training, 10 min/day" },
      ],
    },
  ],
  cooking: [
    {
      kind: "Creators",
      items: [
        { title: "@kenji.lopez", sub: "Food science deep-dives" },
        { title: "@pastry.with.poppy", sub: "Beginner-friendly bakes" },
      ],
    },
    {
      kind: "Communities",
      items: [
        { title: "r/AskCulinary", sub: "Pro chefs answer your questions" },
        { title: "Sourdough Sundays", sub: "Weekly bake-along group" },
      ],
    },
    {
      kind: "Products",
      items: [
        { title: "Lodge 10\" Cast Iron", sub: "The one pan to rule them all" },
        { title: "ThermoWorks Thermapen", sub: "Nail doneness every time" },
      ],
    },
  ],
  running: [
    {
      kind: "Creators",
      items: [
        { title: "@ben.parkes", sub: "Marathon training breakdowns" },
        { title: "@kofuzi", sub: "Honest shoe reviews" },
      ],
    },
    {
      kind: "Communities",
      items: [
        { title: "r/AdvancedRunning", sub: "Plans, pacing, race recaps" },
        { title: "Sunrise 5K Club", sub: "Local easy runs, Tue + Thu" },
      ],
    },
    {
      kind: "Products",
      items: [
        { title: "Coros Pace 3", sub: "Lightweight GPS + pacing" },
        { title: "Maurten Gel 100", sub: "Race-day fueling staple" },
      ],
    },
  ],
  parenting: [
    {
      kind: "Creators",
      items: [
        { title: "@biglittlefeelings", sub: "Toddler tantrum toolkit" },
        { title: "@drbeckyatgoodinside", sub: "Calm, science-backed scripts" },
      ],
    },
    {
      kind: "Communities",
      items: [
        { title: "r/Parenting", sub: "1.6M parents sharing wins" },
        { title: "Neighborhood Playdate Group", sub: "Saturdays at the park" },
      ],
    },
    {
      kind: "Products",
      items: [
        { title: "Hatch Rest+", sub: "Sleep sounds + sunrise clock" },
        { title: "Yoto Mini", sub: "Screen-free audio for kids" },
      ],
    },
  ],
  travel: [
    {
      kind: "Creators",
      items: [
        { title: "@drewbinsky", sub: "Stories from every country" },
        { title: "@theblondeabroad", sub: "Solo travel guides" },
      ],
    },
    {
      kind: "Communities",
      items: [
        { title: "r/solotravel", sub: "Trip planning + safety tips" },
        { title: "Slow Travel Collective", sub: "Stay longer, spend less" },
      ],
    },
    {
      kind: "Products",
      items: [
        { title: "Peak Design 30L", sub: "Carry-on that opens flat" },
        { title: "Airalo eSIM", sub: "Data in 200+ countries" },
      ],
    },
  ],
};

function getSectionsForTopic(topic: string): Section[] {
  return TOPIC_CONTENT[topic.toLowerCase()] ?? [
    {
      kind: "Creators",
      items: [
        { title: `Top voices in ${topic}`, sub: "Curated from people you follow" },
        { title: "Rising creators this week", sub: "New perspectives to explore" },
      ],
    },
    {
      kind: "Communities",
      items: [
        { title: `${topic} starter group`, sub: "Friendly space for beginners" },
        { title: "Weekly check-in thread", sub: "Share progress, get feedback" },
      ],
    },
    {
      kind: "Products",
      items: [
        { title: `${topic} starter kit`, sub: "Highly-rated basics" },
        { title: "Tracking app picks", sub: "Stay consistent with your goal" },
      ],
    },
  ];
}

export function MetaAIPanel({
  topic,
  stage,
  intro,
  onClose,
  onStartJourney,
  startJourneyLabel,
}: {
  topic: string;
  stage?: string;
  intro?: string;
  onClose: () => void;
  onStartJourney?: () => void;
  startJourneyLabel?: string;
}) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [followUp, setFollowUp] = useState("");
  const [refined, setRefined] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);
  const sections = getSectionsForTopic(topic);
  const contextLine =
    intro ??
    (stage
      ? `You're currently ${stage.toLowerCase()} on your ${topic.toLowerCase()} journey — here are picks tailored to where you are right now.`
      : undefined);
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="flex max-h-[90%] w-full flex-col rounded-t-3xl bg-white p-4">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-300" />
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Suggestions for you</div>
              <div className="text-[11px] text-neutral-500">
                Curated · {topic}
              </div>
            </div>
          </div>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-neutral-600" />
          </button>
        </div>
        {contextLine ? (
          <div className="mb-3 rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 px-3 py-2 text-xs leading-snug text-violet-900">
            {contextLine}
          </div>
        ) : null}
        {refined ? (
          <div className="mb-3 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs text-violet-900">
            <span className="font-semibold">Refined for:</span> {refined}
          </div>
        ) : null}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <div className="flex items-center gap-2 text-sm font-medium text-violet-600">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Thinking…</span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500" />
                </span>
              </div>
              <div className="w-full space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
                    <div className="h-12 animate-pulse rounded-xl bg-neutral-100" />
                    <div className="h-12 animate-pulse rounded-xl bg-neutral-100" />
                  </div>
                ))}
              </div>
            </div>
          ) : sections.map((sec) => (
            <div key={sec.kind} className="mb-3">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-violet-600">
                {sec.kind}
              </div>
              <ul className="divide-y divide-neutral-100 rounded-xl border border-neutral-100">
                {sec.items.map((it) => (
                  <li key={it.title} className="flex items-center justify-between px-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{it.title}</div>
                      <div className="truncate text-xs text-neutral-600">{it.sub}</div>
                    </div>
                    <button className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold">
                      View
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!followUp.trim()) return;
            setRefined(followUp.trim());
            setFollowUp("");
          }}
          className="mt-2 flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5"
        >
          <Sparkles className="h-4 w-4 text-violet-500" />
          <input
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            placeholder="Ask a follow-up or refine your goal…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
          <button
            type="submit"
            disabled={!followUp.trim()}
            className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
        {onStartJourney ? (
          <button
            onClick={onStartJourney}
            className="mt-2 w-full rounded-full bg-neutral-900 py-2.5 text-sm font-semibold text-white"
          >
            {startJourneyLabel ?? "Start a journey from this"}
          </button>
        ) : null}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
          <span>Was this helpful?</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFeedback("up")}
              className={
                "rounded-full p-1.5 " +
                (feedback === "up" ? "bg-green-100 text-green-700" : "text-neutral-600")
              }
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => setFeedback("down")}
              className={
                "rounded-full p-1.5 " +
                (feedback === "down" ? "bg-rose-100 text-rose-700" : "text-neutral-600")
              }
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        </div>
        {feedback ? (
          <p className="mt-2 text-center text-[11px] text-neutral-500">
            Thanks — we'll tune your suggestions.
          </p>
        ) : null}
      </div>
    </div>
  );
}