import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { useState } from "react";

export function PostActions({ initialLikes }: { initialLikes: number }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const likes = initialLikes + (liked ? 1 : 0);
  return (
    <>
      <div className="flex items-center justify-between px-3 pt-2">
        <div className="flex items-center gap-4">
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
        <button onClick={() => setSaved((v) => !v)}>
          <Bookmark
            className="h-6 w-6 text-neutral-900"
            fill={saved ? "currentColor" : "none"}
            strokeWidth={1.8}
          />
        </button>
      </div>
      <div className="px-3 pt-1.5 text-sm font-semibold text-neutral-900">
        {likes.toLocaleString()} likes
      </div>
    </>
  );
}