import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PhoneFrame } from "../components/PhoneFrame";
import { TopBar } from "../components/TopBar";
import { BackButton } from "../components/BackButton";
import { COVER_OPTIONS } from "../data/mock";
import { useApp } from "../state/AppState";
import { Sparkles, Upload } from "lucide-react";
import { parseReminder } from "../lib/utils";

export const Route = createFileRoute("/journey/$id/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { getJourney } = useApp();
  const j = getJourney(id);
  const [title, setTitle] = useState(j?.title ?? "");
  const [desc, setDesc] = useState(j?.description ?? "");
  const [timeline, setTimeline] = useState(j?.timeline ?? "");
  const [reminder, setReminder] = useState("");
  const [cover, setCover] = useState(j?.cover ?? COVER_OPTIONS[0]);
  const [userCovers, setUserCovers] = useState<string[]>([]);
  const coverInput = useRef<HTMLInputElement>(null);

  if (!j) return null;
  const allCovers = [...userCovers, ...COVER_OPTIONS];
  const reminderPreview = parseReminder(reminder);

  return (
    <PhoneFrame>
      <TopBar title="Journey settings" />
      <div className="flex items-center gap-2 border-b border-neutral-200 bg-white px-3 py-2">
        <BackButton onClick={() => navigate({ to: "/journey/$id", params: { id } })} />
      </div>
      <main className="flex-1 overflow-y-auto p-4">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none"
          />
        </Field>
        <Field label="Description">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="min-h-[80px] w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none"
          />
        </Field>
        <Field label="Expected timeline (optional)">
          <input
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. 3 months"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none"
          />
        </Field>
        <Field label="Reminder schedule">
          <input
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            placeholder='e.g. "Mondays at 2pm every week"'
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none"
          />
          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-700">
            <Sparkles className="h-3 w-3" /> {reminderPreview}
          </div>
        </Field>
        <Field label="Theme photo">
          <div className="grid grid-cols-3 gap-2">
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
        </Field>
        <button
          onClick={() => navigate({ to: "/journey/$id", params: { id } })}
          className="mt-4 w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white"
        >
          Save changes
        </button>
      </main>
    </PhoneFrame>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-xs font-semibold text-neutral-700">{label}</span>
      {children}
    </label>
  );
}