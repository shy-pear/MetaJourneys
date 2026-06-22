import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "../components/PhoneFrame";
import { TopBar } from "../components/TopBar";
import { BackButton } from "../components/BackButton";
import { useApp } from "../state/AppState";
import {
  Sparkles,
  Check,
  MoreVertical,
  Settings as SettingsIcon,
  PlayCircle,
  PlusCircle,
  Trophy,
  X,
  Heart,
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react";
import { MetaAIPanel } from "../components/MetaAIPanel";
import type { Post, Journey } from "../data/mock";
import { getLastMainRoute } from "../lib/nav";

export const Route = createFileRoute("/journey/$id/")({
  head: () => ({ meta: [{ title: "Journey · Glimpse" }] }),
  component: JourneyDetail,
  notFoundComponent: () => (
    <PhoneFrame>
      <TopBar title="Journey" />
      <div className="p-6 text-sm text-neutral-600">Journey not found.</div>
    </PhoneFrame>
  ),
});

function JourneyDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { getJourney, isOwned, isFollowing, isCompleted, toggleFollow, deleteJourney } = useApp();
  const j = getJourney(id);
  const [menu, setMenu] = useState(false);
  const [ai, setAi] = useState(false);
  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!j) {
    return (
      <PhoneFrame>
        <TopBar title="Journey" />
        <div className="p-6 text-sm text-neutral-600">Journey not found.</div>
      </PhoneFrame>
    );
  }

  const owner = isOwned(j.id);
  const following = isFollowing(j.id);
  const completed = isCompleted(j.id);

  return (
    <PhoneFrame>
      <TopBar title="Journey" />
      <main className="flex-1 overflow-y-auto">
        {j.highlight && j.highlight.images.length ? (
          <div className="border-b border-neutral-200 px-3 py-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-neutral-700">
                Highlights
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {j.highlight.images.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    setOpenPost({
                      id: `hl${i}`,
                      type: "photo",
                      url,
                      caption: j.highlight?.caption ?? "",
                      daysAgo: 0,
                      likes: 0,
                    })
                  }
                  className="shrink-0 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-600 p-[2px]"
                  aria-label={`Highlight ${i + 1}`}
                >
                  <img
                    src={url}
                    alt=""
                    className="h-16 w-16 rounded-full border-2 border-white object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="relative">
          <img src={j.cover} alt="" className="aspect-[16/10] w-full object-cover" />
          <div className="absolute left-3 top-3">
            <BackButton onClick={() => navigate({ to: getLastMainRoute() })} />
          </div>
          {owner ? (
            <button
              onClick={() => setMenu((v) => !v)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          ) : null}
          {menu ? (
            <div className="absolute right-3 top-12 z-10 w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white text-sm shadow-lg">
              <MenuItem onClick={() => setMenu(false)}>Archive</MenuItem>
              <MenuItem onClick={() => setMenu(false)}>Pause</MenuItem>
              <MenuItem
                onClick={() => {
                  setMenu(false);
                  navigate({ to: "/journey/$id/complete", params: { id: j.id } });
                }}
              >
                Mark complete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMenu(false);
                  setConfirmDelete(true);
                }}
              >
                <span className="inline-flex items-center text-red-600">
                  <Trash2 className="mr-2 inline h-4 w-4" /> Delete journey
                </span>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMenu(false);
                  navigate({ to: "/journey/$id/settings", params: { id: j.id } });
                }}
              >
                <SettingsIcon className="mr-2 inline h-4 w-4" /> Journey settings
              </MenuItem>
            </div>
          ) : null}
        </div>

        <div className="px-4 pt-3">
          {!owner ? (
            <div className="mb-2 flex items-center gap-2">
              <img
                src={j.ownerAvatar}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">@{j.owner}</p>
                <p className="text-[11px] text-neutral-500">Journey creator</p>
              </div>
              <button
                onClick={() => toggleFollow(j.id)}
                className={
                  "rounded-full px-3 py-1 text-xs font-semibold " +
                  (following
                    ? "border border-neutral-300 bg-white text-neutral-900"
                    : "bg-sky-500 text-white")
                }
              >
                {following ? "Following" : "Follow"}
              </button>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <h1 className="flex-1 text-xl font-bold">{j.title}</h1>
            {completed ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                <Trophy className="h-3 w-3" /> Completed
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-neutral-700">{j.description}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-neutral-50 p-3 text-center text-xs">
            <Cell label="Started" value={j.startDate} />
            <Cell label="Timeline" value={j.timeline} />
            <Cell label="Following" value={`${j.followers}`} />
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-[12px] text-neutral-600">
            <Sparkles className="h-3 w-3 text-amber-500" /> {j.stage}
          </p>

          <div className="mt-3 flex gap-2">
            <Link
              to="/journey/$id/story"
              params={{ id: j.id }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-neutral-300 py-2.5 text-sm font-semibold"
            >
              <PlayCircle className="h-4 w-4" /> View as story
            </Link>
            {owner ? (
              <Link
                to="/journey/$id/add"
                params={{ id: j.id }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white"
              >
                <PlusCircle className="h-4 w-4" /> Add update
              </Link>
            ) : (
              <button
                onClick={() => toggleFollow(j.id)}
                className={
                  "flex-1 rounded-xl py-2.5 text-sm font-semibold " +
                  (following
                    ? "border border-neutral-300 bg-white text-neutral-900"
                    : "bg-neutral-900 text-white")
                }
              >
                {following ? (
                  <span className="inline-flex items-center gap-1">
                    <Check className="h-4 w-4" /> Following
                  </span>
                ) : (
                  "Follow along"
                )}
              </button>
            )}
          </div>

          {owner ? (
            <button
              onClick={() => setAi(true)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-violet-700"
            >
              <Sparkles className="h-3.5 w-3.5" /> Need inspiration?
            </button>
          ) : null}
        </div>

        <div className="mt-5 border-t border-neutral-200">
          <h2 className="px-4 py-3 text-sm font-semibold">Timeline</h2>
          <ul className="divide-y divide-neutral-100">
            {j.posts.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setOpenPost(p)}
                  className="flex w-full gap-3 p-3 text-left hover:bg-neutral-50"
                >
                {p.type === "photo" && p.url ? (
                  <img
                    src={p.url}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-lg object-cover"
                  />
                ) : p.type === "video" && p.url ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-black">
                    <img
                      src={p.poster}
                      alt=""
                      className="h-full w-full object-cover opacity-80"
                    />
                    <PlayCircle className="absolute inset-0 m-auto h-7 w-7 text-white" />
                  </div>
                ) : (
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-amber-100 to-rose-100 text-[10px] font-semibold text-neutral-700">
                    NOTE
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-900">{p.caption}</p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    {p.daysAgo === 0 ? "Just now" : `${p.daysAgo}d ago`} · {p.likes} likes
                  </p>
                </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
      {ai ? (
        <MetaAIPanel
          topic={j.theme}
          stage={j.stage}
          onClose={() => setAi(false)}
        />
      ) : null}
      {openPost ? (
        <PostDetailModal journey={j} post={openPost} onClose={() => setOpenPost(null)} />
      ) : null}
      {confirmDelete ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-neutral-900">Delete journey?</h3>
            <p className="mt-1 text-sm text-neutral-600">
              “{j.title}” will be removed from your profile. This can’t be undone.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteJourney(j.id);
                  navigate({ to: "/profile" });
                }}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PhoneFrame>
  );
}

function PostDetailModal({
  journey,
  post,
  onClose,
}: {
  journey: Journey;
  post: Post;
  onClose: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ user: string; text: string }[]>([
    { user: "devon", text: "let's go 🔥" },
    { user: "priya.s", text: "so inspiring!" },
  ]);
  const likes = post.likes + (liked ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white">
        <header className="flex items-center justify-between border-b border-neutral-200 px-3 py-2">
          <div className="flex items-center gap-2">
            <img
              src={journey.ownerAvatar}
              alt=""
              className="h-7 w-7 rounded-full object-cover"
            />
            <span className="text-sm font-semibold">{journey.owner}</span>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {post.type === "photo" && post.url ? (
            <img src={post.url} alt="" className="aspect-square w-full object-cover" />
          ) : post.type === "video" && post.url ? (
            <video
              src={post.url}
              poster={post.poster}
              controls
              playsInline
              className="aspect-square w-full bg-black object-contain"
            />
          ) : (
            <div className="bg-gradient-to-br from-amber-100 to-rose-100 p-8 text-center text-base text-neutral-800">
              {post.caption}
            </div>
          )}

          <div className="flex items-center gap-4 px-3 pt-2">
            <button onClick={() => setLiked((v) => !v)}>
              <Heart
                className={"h-6 w-6 " + (liked ? "text-red-500" : "text-neutral-900")}
                fill={liked ? "currentColor" : "none"}
                strokeWidth={1.8}
              />
            </button>
            <MessageCircle className="h-6 w-6 text-neutral-900" strokeWidth={1.8} />
            <Send className="h-6 w-6 text-neutral-900" strokeWidth={1.8} />
          </div>
          <div className="px-3 pt-1.5 text-sm font-semibold">
            {likes.toLocaleString()} likes
          </div>
          {post.type !== "text" ? (
            <p className="px-3 pt-1 text-sm">
              <span className="font-semibold">{journey.owner}</span> {post.caption}
            </p>
          ) : null}
          <p className="px-3 pb-2 pt-0.5 text-[11px] text-neutral-500">
            {post.daysAgo === 0 ? "Just now" : `${post.daysAgo}d ago`}
          </p>

          <div className="border-t border-neutral-100 px-3 py-2">
            {comments.map((c, i) => (
              <p key={i} className="py-0.5 text-sm">
                <span className="font-semibold">{c.user}</span> {c.text}
              </p>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const t = comment.trim();
            if (!t) return;
            setComments((cs) => [...cs, { user: "alex.rivera", text: t }]);
            setComment("");
          }}
          className="flex items-center gap-2 border-t border-neutral-200 px-3 py-2"
        >
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="text-sm font-semibold text-sky-600 disabled:text-sky-300"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

function MenuItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="block w-full px-3 py-2 text-left hover:bg-neutral-50"
    >
      {children}
    </button>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase text-neutral-500">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-neutral-900">{value}</div>
    </div>
  );
}