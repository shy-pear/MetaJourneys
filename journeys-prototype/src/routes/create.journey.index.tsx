import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PhoneFrame } from "../components/PhoneFrame";
import { TopBar } from "../components/TopBar";
import { BackButton } from "../components/BackButton";
import { COVER_OPTIONS, inferTheme } from "../data/mock";
import { Sparkles, Upload } from "lucide-react";
import { parseReminder } from "../lib/utils";
import { getLastMainRoute } from "../lib/nav";

export const Route = createFileRoute("/create/journey/")({
  head: () => ({ meta: [{ title: "Start a Journey · Glimpse" }] }),
  component: NewJourneyPage,
});


function NewJourneyPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cover, setCover] = useState<string>(COVER_OPTIONS[0]);
  const [userCovers, setUserCovers] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");
  const [reminderText, setReminderText] = useState("");
  const titleInput = useRef<HTMLInputElement>(null);
  const descInput = useRef<HTMLTextAreaElement>(null);
  const timelineInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  const theme = inferTheme(`${title} ${desc}`);
  const canNext = title.trim().length > 1;
  const reminderPreview = parseReminder(reminderText);
  const allCovers = [...userCovers, ...COVER_OPTIONS];

  function next() {
    const nextTitle = titleInput.current?.value.trim() ?? title.trim();
    if (nextTitle.length < 2) {
      titleInput.current?.focus();
      return;
    }
    const id = "new-" + Math.random().toString(36).slice(2, 8);
    const payload = {
      id,
      title: nextTitle,
      description: descInput.current?.value.trim() || desc.trim() || "A new journey.",
      theme: inferTheme(
        `${nextTitle} ${descInput.current?.value.trim() || desc.trim()}`,
      ),
      cover,
      timeline: timelineInput.current?.value.trim() || timeline.trim(),
    };
    sessionStorage.setItem("draftJourney", JSON.stringify(payload));
    navigate({ to: "/create/journey/first-post" });
  }

  return (
    <PhoneFrame>
      <TopBar title="Start a Journey" />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="mb-2">
          <BackButton
            onClick={() => {
              navigate({ to: getLastMainRoute() });
            }}
          />
        </div>

        <label className="block">
          <span className="text-xs font-semibold text-neutral-700">Title</span>
          <input
            ref={titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Learning Spanish"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </label>

        <label className="mt-3 block">
          <span className="text-xs font-semibold text-neutral-700">Description</span>
          <textarea
            ref={descInput}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="What is this journey about? How will you know you're done?"
            className="mt-1 min-h-[88px] w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </label>

        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
          <Sparkles className="h-3 w-3" /> Theme auto-tagged: {theme}
        </div>

        <div className="mt-4">
          <span className="text-xs font-semibold text-neutral-700">Theme photo</span>
          <div className="mt-1 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => coverInput.current?.click()}
              className="grid aspect-square place-items-center rounded-lg border-2 border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-400"
              aria-label="Upload from device"
            >
              <Upload className="h-5 w-5" />
            </button>
            <input
              ref={coverInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = URL.createObjectURL(f);
                setUserCovers((prev) => [url, ...prev]);
                setCover(url);
                e.target.value = "";
              }}
            />
            {allCovers.map((c) => (
              <button
                key={c}
                onClick={() => setCover(c)}
                className={
                  "overflow-hidden rounded-lg " +
                  (cover === c ? "ring-2 ring-neutral-900" : "")
                }
              >
                <img src={c} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <span className="text-xs font-semibold text-neutral-700">
            Expected timeline (optional)
          </span>
          <p className="text-[11px] text-neutral-500">
            e.g. "12 weeks", "by July", "ongoing"
          </p>
          <input
            ref={timelineInput}
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="12 weeks"
            className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        <div className="mt-5">
          <span className="text-xs font-semibold text-neutral-700">Reminder schedule</span>
          <p className="text-[11px] text-neutral-500">
            Optional. Describe in your own words — e.g. "Mondays at 2pm every week".
          </p>
          <input
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            placeholder="Mondays at 2pm every week"
            className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-700">
            <Sparkles className="h-3 w-3" /> {reminderPreview}
          </div>
        </div>

        <button
          onClick={next}
          data-ready={canNext ? "true" : "false"}
          className={
            "mt-6 w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white " +
            (!canNext ? "opacity-40" : "")
          }
        >
          Next: make your first post
        </button>
      </main>
    </PhoneFrame>
  );
}