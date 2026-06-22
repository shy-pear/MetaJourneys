import { useRef, useState } from "react";
import { Image as ImageIcon, Video, Type, Upload } from "lucide-react";
import type { Post, PostType } from "../data/mock";

const PHOTO_OPTIONS = [
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80",
];
const VIDEO_OPTION = {
  url: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
  poster:
    "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=800&q=80",
};

export function Composer({
  onPost,
  ctaLabel = "Share",
}: {
  onPost: (post: Post) => void;
  ctaLabel?: string;
}) {
  const [type, setType] = useState<PostType>("photo");
  const [photoIdx, setPhotoIdx] = useState(0);
  const [caption, setCaption] = useState("");
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  const [userVideo, setUserVideo] = useState<{ url: string; poster?: string } | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  const allPhotos = [...userPhotos, ...PHOTO_OPTIONS];
  const currentVideo = userVideo ?? VIDEO_OPTION;

  const disabled = type === "text" && caption.trim().length === 0;

  function handlePost() {
    const id = "u" + Math.random().toString(36).slice(2, 8);
    const base = { id, caption: caption || "(no caption)", daysAgo: 0, likes: 0 };
    if (type === "photo")
      onPost({ ...base, type: "photo", url: allPhotos[photoIdx] });
    else if (type === "video")
      onPost({
        ...base,
        type: "video",
        url: currentVideo.url,
        poster: currentVideo.poster,
      });
    else onPost({ ...base, type: "text" });
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-1 rounded-xl bg-neutral-100 p-1 text-sm">
        {(
          [
            { k: "photo", label: "Photo", icon: ImageIcon },
            { k: "video", label: "Video", icon: Video },
            { k: "text", label: "Text", icon: Type },
          ] as const
        ).map(({ k, label, icon: Icon }) => (
          <button
            key={k}
            onClick={() => setType(k)}
            className={
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-medium " +
              (type === k ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600")
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {type === "photo" ? (
        <div>
          <img
            src={allPhotos[photoIdx]}
            alt=""
            className="aspect-square w-full rounded-xl object-cover"
          />
          <div className="mt-2 flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => photoInput.current?.click()}
              className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border-2 border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-400"
              aria-label="Upload from device"
            >
              <Upload className="h-5 w-5" />
            </button>
            <input
              ref={photoInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (!files.length) return;
                const urls = files.map((f) => URL.createObjectURL(f));
                setUserPhotos((prev) => [...urls, ...prev]);
                setPhotoIdx(0);
                e.target.value = "";
              }}
              multiple
            />
            {allPhotos.map((p, i) => (
              <button
                key={p}
                onClick={() => setPhotoIdx(i)}
                className={
                  "shrink-0 overflow-hidden rounded-lg " +
                  (i === photoIdx ? "ring-2 ring-neutral-900" : "")
                }
              >
                <img src={p} alt="" className="h-16 w-16 object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {type === "video" ? (
        <div>
          <video
            key={currentVideo.url}
            src={currentVideo.url}
            poster={currentVideo.poster}
            controls
            muted
            playsInline
            className="aspect-square w-full rounded-xl bg-black object-cover"
          />
          <button
            type="button"
            onClick={() => videoInput.current?.click()}
            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            <Upload className="h-4 w-4" /> Choose from device
          </button>
          <input
            ref={videoInput}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setUserVideo({ url: URL.createObjectURL(f) });
              e.target.value = "";
            }}
          />
        </div>
      ) : null}

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder={type === "text" ? "What's the update?" : "Write a caption…"}
        className="min-h-[96px] w-full resize-none rounded-xl border border-neutral-200 p-3 text-sm outline-none focus:border-neutral-400"
      />

      <button
        disabled={disabled}
        onClick={handlePost}
        className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white disabled:opacity-40"
      >
        {ctaLabel}
      </button>
    </div>
  );
}