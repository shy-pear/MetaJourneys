import { MoreHorizontal } from "lucide-react";
import { PostActions } from "./PostActions";
import { FRIEND_POST } from "../data/mock";

export function FriendPostCard() {
  const p = FRIEND_POST;
  return (
    <article className="border-b border-neutral-200 pb-3">
      <header className="flex items-center justify-between px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <img src={p.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-semibold">{p.username}</div>
            <div className="truncate text-[11px] text-neutral-500">{p.location}</div>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-neutral-700" />
      </header>
      <img src={p.url} alt="" className="aspect-square w-full object-cover" />
      <PostActions initialLikes={p.likes} />
      <p className="px-3 pt-1.5 text-sm">
        <span className="font-semibold">{p.username}</span> {p.caption}
      </p>
      <p className="px-3 pt-0.5 text-[11px] uppercase text-neutral-500">{p.timeAgo}</p>
    </article>
  );
}