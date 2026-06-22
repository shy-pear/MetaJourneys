import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "../components/PhoneFrame";
import { TopBar } from "../components/TopBar";
import { useApp } from "../state/AppState";
import { Trophy, ArrowUp, ArrowDown, Check } from "lucide-react";
import type { Journey } from "../data/mock";


export const Route = createFileRoute("/journey/$id/complete")({
  component: CompletePage,
});

function CompletePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { getJourney, completeJourney, addPost } = useApp();
  const j = getJourney(id);
  const [caption, setCaption] = useState("we did the thing 🎉");
  const candidates = (j?.posts ?? [])
    .map((p) => (p.type === "photo" ? p.url : p.poster) as string | undefined)
    .filter((u): u is string => Boolean(u));
  const [selected, setSelected] = useState<string[]>(() => candidates.slice(0, 5));

  if (!j) return null;

  const oldest = j.posts[j.posts.length - 1]?.daysAgo ?? 0;

  function toggle(url: string) {
    setSelected((s) =>
      s.includes(url) ? s.filter((u) => u !== url) : [...s, url],
    );
  }
  function move(url: string, dir: -1 | 1) {
    setSelected((s) => {
      const i = s.indexOf(url);
      const j2 = i + dir;
      if (i < 0 || j2 < 0 || j2 >= s.length) return s;
      const n = [...s];
      [n[i], n[j2]] = [n[j2], n[i]];
      return n;
    });
  }

  function share() {
    if (!j) return;
    const statsUrl = buildCompletionImage(j, caption);
    completeJourney(j.id, { images: selected, caption });
    addPost(j.id, {
      id: "c" + Math.random().toString(36).slice(2, 7),
      type: "photo",
      url: statsUrl,
      caption,
      daysAgo: 0,
      likes: 0,
    });
    navigate({ to: "/profile" });
  }

  function buildCompletionImage(journey: Journey, captionText: string): string {
    const W = 1080;
    const H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return journey.cover;

    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, "#f59e0b");
    gradient.addColorStop(0.45, "#fb7185");
    gradient.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";

    ctx.font = "700 64px system-ui, -apple-system, sans-serif";
    ctx.fillText("🏆", W / 2, 260);

    ctx.font = "700 72px system-ui, -apple-system, sans-serif";
    ctx.fillText("Journey complete", W / 2, 360);

    ctx.font = "600 52px system-ui, -apple-system, sans-serif";
    const title = journey.title.length > 30 ? journey.title.slice(0, 28) + "…" : journey.title;
    ctx.fillText(title, W / 2, 460);

    const oldest = journey.posts[journey.posts.length - 1]?.daysAgo ?? 0;
    const stats = [
      { value: `${oldest}d`, label: "Duration" },
      { value: `${journey.posts.length}`, label: "Posts" },
      { value: `${journey.followers}`, label: "Follows" },
    ];

    const boxY = 620;
    const boxW = 260;
    const boxH = 220;
    const gap = 32;
    const startX = (W - (stats.length * boxW + (stats.length - 1) * gap)) / 2;

    stats.forEach((s, i) => {
      const x = startX + i * (boxW + gap);
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      roundRect(ctx, x, boxY, boxW, boxH, 24);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 84px system-ui, -apple-system, sans-serif";
      ctx.fillText(s.value, x + boxW / 2, boxY + 110);

      ctx.font = "500 32px system-ui, -apple-system, sans-serif";
      ctx.fillText(s.label.toUpperCase(), x + boxW / 2, boxY + 165);
    });

    ctx.font = "400 40px system-ui, -apple-system, sans-serif";
    const lines = wrapText(ctx, captionText, 840);
    let y = 1040;
    lines.slice(0, 4).forEach((line) => {
      ctx.fillText(line, W / 2, y);
      y += 56;
    });

    ctx.font = "700 36px system-ui, -apple-system, sans-serif";
    ctx.globalAlpha = 0.8;
    ctx.fillText("glimpse", W / 2, 1250);
    ctx.globalAlpha = 1;

    return canvas.toDataURL("image/png");
  }

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      const metrics = ctx.measureText(test);
      if (metrics.width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  return (
    <PhoneFrame>
      <TopBar title="Journey complete" />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-gradient-to-br from-amber-400 via-rose-400 to-violet-500 p-6 text-white">
          <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
            <Trophy className="h-3 w-3" /> Journey wrapped
          </div>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight">{j.title}</h1>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Big n={`${oldest}d`} label="duration" />
            <Big n={`${j.posts.length}`} label="posts" />
            <Big n={`${j.followers}`} label="follows" />
          </div>
          <div className="mt-5 -mx-6 flex gap-2 overflow-x-auto px-6 pb-2">
            {selected.length
              ? selected.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="h-32 w-24 shrink-0 rounded-xl object-cover ring-2 ring-white/60"
                  />
                ))
              : (
                <img
                  src={j.cover}
                  alt=""
                  className="h-32 w-24 shrink-0 rounded-xl object-cover ring-2 ring-white/60"
                />
              )}
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-700">
                Customize highlight reel
              </label>
              <span className="text-[11px] text-neutral-500">
                {selected.length} selected
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Tap to add/remove. Use arrows to reorder.
            </p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {candidates.map((url) => {
                const idx = selected.indexOf(url);
                const isSel = idx >= 0;
                return (
                  <div key={url} className="relative">
                    <button
                      type="button"
                      onClick={() => toggle(url)}
                      className={
                        "block w-full overflow-hidden rounded-lg " +
                        (isSel ? "ring-2 ring-neutral-900" : "opacity-70")
                      }
                    >
                      <img
                        src={url}
                        alt=""
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                    {isSel ? (
                      <>
                        <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                          {idx + 1}
                        </span>
                        <div className="absolute bottom-1 right-1 flex gap-0.5">
                          <button
                            type="button"
                            onClick={() => move(url, -1)}
                            className="grid h-5 w-5 place-items-center rounded bg-white/90"
                            aria-label="Move left"
                          >
                            <ArrowUp className="h-3 w-3 -rotate-90" />
                          </button>
                          <button
                            type="button"
                            onClick={() => move(url, 1)}
                            className="grid h-5 w-5 place-items-center rounded bg-white/90"
                            aria-label="Move right"
                          >
                            <ArrowDown className="h-3 w-3 -rotate-90" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white/80">
                        <Check className="h-3 w-3 text-neutral-400" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <label className="text-xs font-semibold text-neutral-700">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-1 min-h-[80px] w-full resize-none rounded-xl border border-neutral-200 p-3 text-sm outline-none focus:border-neutral-400"
          />
          <button
            onClick={share}
            className="mt-3 w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white"
          >
            Share to journey
          </button>
        </div>
      </main>
    </PhoneFrame>
  );
}

function Big({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/15 p-3 text-center backdrop-blur">
      <div className="text-2xl font-extrabold">{n}</div>
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}