import { Link } from "@tanstack/react-router";
import { Check, MoreHorizontal, Sparkles } from "lucide-react";
import type { Journey, Post } from "../data/mock";
import { PostActions } from "./PostActions";

export function JourneyPostCard({ journey, post }: { journey: Journey; post: Post }) {
  return (
    <article className="border-b border-neutral-200 pb-3">
      <header className="flex items-center justify-between px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <img
            src={journey.ownerAvatar}
            alt=""
            className="h-9 w-9 rounded-full object-cover ring-2 ring-amber-400"
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-semibold">{journey.owner}</div>
            <div className="flex min-w-0 items-center gap-1 text-[11px] text-neutral-600">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span className="truncate">{journey.stage}</span>
            </div>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-neutral-700" />
      </header>

      <div className="mx-3 mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">
        <Check className="h-3 w-3" /> Following · {journey.title}
      </div>

      {post.type === "video" && post.url ? (
        <video
          src={post.url}
          poster={post.poster}
          controls
          muted
          playsInline
          className="aspect-square w-full bg-black object-cover"
        />
      ) : post.type === "photo" && post.url ? (
        <img src={post.url} alt="" className="aspect-square w-full object-cover" />
      ) : (
        <div className="mx-3 rounded-2xl bg-gradient-to-br from-amber-100 to-rose-100 p-6 text-base text-neutral-800">
          {post.caption}
        </div>
      )}

      <PostActions initialLikes={post.likes} />
      {post.type !== "text" ? (
        <p className="px-3 pt-1.5 text-sm">
          <span className="font-semibold">{journey.owner}</span> {post.caption}
        </p>
      ) : null}

      <div className="px-3 pt-2">
        <Link
          to="/journey/$id"
          params={{ id: journey.id }}
          className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-900"
        >
          View full journey →
        </Link>
      </div>
    </article>
  );
}