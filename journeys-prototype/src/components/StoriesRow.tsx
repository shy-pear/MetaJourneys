import { STORIES } from "../data/mock";
import { Plus } from "lucide-react";

export function StoriesRow({ onOpenYourStories }: { onOpenYourStories?: () => void }) {
  return (
    <div className="flex gap-4 overflow-x-auto border-b border-neutral-200 px-3 py-3">
      {STORIES.map((s) => (
        <button
          key={s.id}
          onClick={() => s.you && onOpenYourStories && onOpenYourStories()}
          className={"flex w-16 shrink-0 flex-col items-center gap-1 outline-none text-left " + (s.you ? "cursor-pointer active:scale-95 transition" : "opacity-80")}
        >
          <div className="relative">
            <div
              className={
                "rounded-full p-[2px] " +
                (s.you
                  ? "bg-gradient-to-tr from-emerald-400 via-teal-500 to-sky-500 animate-pulse shadow-sm"
                  : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600")
              }
            >
              <div className="rounded-full bg-white p-[2px]">
                <img
                  src={s.avatar}
                  alt=""
                  className="h-14 w-14 rounded-full object-cover"
                />
              </div>
            </div>
            {s.you ? (
              <div className="absolute right-0 bottom-0 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-teal-500 text-white">
                <Plus className="h-3 w-3" />
              </div>
            ) : null}
          </div>
          <span className="w-16 truncate text-center text-[11px] font-medium text-neutral-800">
            {s.username}
          </span>
        </button>
      ))}
    </div>
  );
}