import { useRef, useState } from "react";
import { 
  Image as ImageIcon, 
  Video, 
  Upload, 
  MapPin, 
  Smile, 
  Sparkles, 
  Check, 
  Layers, 
  TrendingUp, 
  X
} from "lucide-react";
import type { Post, PostType } from "../data/mock";
import { useApp } from "../state/AppState";

const PHOTO_OPTIONS = [
  "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80",
];

const VIDEO_OPTION = {
  url: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
  poster: "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=800&q=80",
};

const STICKERS = [
  { label: "🚧 WIP", value: "🚧 Work in Progress" },
  { label: "🏆 MILESTONE", value: "🏆 Milestone Reached!" },
  { label: "💡 BREAKTHROUGH", value: "💡 Breakthrough!" },
  { label: "🎨 SNEAK PEEK", value: "🎨 First Sneak Peek" },
  { label: "🔥 GRINDING", value: "🔥 Grind Session" },
  { label: "🌱 EVOLUTION", value: "🌱 Growth Spurts" }
];

const MOODS = [
  { emoji: "🎯", label: "Focused" }, 
  { emoji: "⚡", label: "Pumped" }, 
  { emoji: "☕", label: "Chill" }, 
  { emoji: "🛠️", label: "In Zone" }, 
  { emoji: "🥵", label: "Nervous" }, 
  { emoji: "🙌", label: "Inspired" }
];

const LOCATIONS = [
  "My Garage Studio",
  "Neighborhood Trails",
  "The Home Lab",
  "Quiet Outdoors",
  "Coffee Shop Corner",
  "Local Meetup Spot"
];

interface ComposerProps {
  onPost: (post: Post) => void;
  ctaLabel?: string;
  journeyId?: string;
  initialStage?: string;
}

export function Composer({
  onPost,
  ctaLabel = "Share",
  journeyId,
  initialStage = ""
}: ComposerProps) {
  const { updateStage } = useApp();
  
  // Basic content states (only photo and video, text removed as requested)
  const [type, setType] = useState<"photo" | "video">("photo");
  const [caption, setCaption] = useState("");
  const [photoIdx, setPhotoIdx] = useState(0);
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  const [userVideo, setUserVideo] = useState<{ url: string; poster?: string } | null>(null);
  
  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  const allPhotos = [...userPhotos, ...PHOTO_OPTIONS];
  const currentVideo = userVideo ?? VIDEO_OPTION;

  // Optional Rich Features
  const [selectedSticker, setSelectedSticker] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isMilestone, setIsMilestone] = useState(false);
  const [syncStageText, setSyncStageText] = useState(initialStage);

  // Expanded panel states for clean picker experience
  const [activePicker, setActivePicker] = useState<"none" | "location" | "mood" | "sticker">("none");

  const isFormInvalid = type === "photo" ? allPhotos.length === 0 : false;

  function handlePost() {
    const id = "u" + Math.random().toString(36).slice(2, 8);
    
    // Combine optional states
    const finalSticker = isMilestone 
      ? "🏆 Milestone Reached!" 
      : (selectedSticker || undefined);

    const postPayload: Post = {
      id,
      daysAgo: 0,
      likes: 0,
      type: type,
      caption: caption || "New update shared!",
      url: type === "photo" ? allPhotos[photoIdx] : currentVideo.url,
      poster: type === "video" ? currentVideo.poster : undefined,
      isStoryStyle: false, // Combined into regular post
      location: selectedLocation || undefined,
      mood: selectedMood || undefined,
      sticker: finalSticker,
      timeLabel: "Just now"
    };

    // Also sync progress stage if edited and changed
    if (journeyId && syncStageText.trim() && syncStageText !== initialStage) {
      updateStage(journeyId, syncStageText.trim());
    }

    onPost(postPayload);
  }

  return (
    <div className="flex flex-col bg-white min-h-full pb-10">
      <div className="p-4 flex flex-col gap-6">
        
        {/* ========================================================= */}
        {/* COMPOSER ROW (MEDIA + CAPTION) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-[90px_1fr] gap-4 bg-neutral-50/50 border border-neutral-100 rounded-2xl p-4">
          {/* Media Preview Aspect Frame */}
          <div className="space-y-1.5 flex flex-col items-center">
            <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider block text-center">
              Preview
            </span>
            <div className="aspect-square w-full rounded-xl overflow-hidden relative border border-neutral-200 bg-neutral-900 flex items-center justify-center">
              {type === "photo" ? (
                <img
                  src={allPhotos[photoIdx]}
                  alt="selected"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full bg-black">
                  <img
                    src={currentVideo.poster}
                    alt="poster"
                    className="w-full h-full object-cover brightness-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/60 p-1.5 rounded-full text-white text-[8px] font-black uppercase">
                      video
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Caption textarea area */}
          <div className="flex flex-col h-full justify-between py-1">
            <label htmlFor="caption" className="sr-only">Caption</label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption... What are you focusing on today? (Roadblocks, small wins, next tasks...)"
              className="w-full h-24 text-xs font-normal border-0 bg-transparent resize-none outline-none focus:ring-0 placeholder:text-neutral-400 text-neutral-800"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* MEDIA TYPE SELECTOR */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider">
              Select Post Media
            </span>
            <div className="flex gap-1.5 bg-neutral-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setType("photo")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                  type === "photo" 
                    ? "bg-white text-neutral-900 shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <ImageIcon className="h-3 w-3" />
                Photo
              </button>
              <button
                type="button"
                onClick={() => setType("video")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                  type === "video" 
                    ? "bg-white text-neutral-900 shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <Video className="h-3 w-3" />
                Video
              </button>
            </div>
          </div>

          {type === "photo" ? (
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {/* Custom upload button */}
              <button
                type="button"
                onClick={() => photoInput.current?.click()}
                className="h-14 w-14 shrink-0 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-400 flex flex-col items-center justify-center bg-white hover:bg-neutral-50 transition"
              >
                <Upload className="h-4 w-4" />
                <span className="text-[8px] font-bold mt-1">Upload</span>
              </button>
              <input
                ref={photoInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (!files.length) return;
                  const urls = files.map((f) => URL.createObjectURL(f as any));
                  setUserPhotos((prev) => [...urls, ...prev]);
                  setPhotoIdx(0);
                  e.target.value = "";
                }}
                multiple
              />
              {allPhotos.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoIdx(idx)}
                  className={`h-14 w-14 rounded-lg overflow-hidden shrink-0 relative transition-transform ${
                    idx === photoIdx ? "ring-2 ring-neutral-900 scale-95" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={p} alt="" className="h-full w-full object-cover" />
                  {idx === photoIdx && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-neutral-800">Prepped: Jellyfish Demo Video</h4>
                <p className="text-[10px] text-neutral-500">Short video formats work best for feed items.</p>
              </div>
              <button
                type="button"
                onClick={() => videoInput.current?.click()}
                className="rounded-lg bg-white border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100 flex items-center gap-1.5"
              >
                <Upload className="h-3.5 w-3.5 text-neutral-500" />
                Replace Video
              </button>
              <input
                ref={videoInput}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setUserVideo({ url: URL.createObjectURL(f), poster: "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=800&q=80" });
                  e.target.value = "";
                }}
              />
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* OPTIONAL RICH DETAILS (INSTAGRAM STYLE LIST) */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <div className="border-b border-neutral-100 pb-1">
            <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider block">
              Optional Details
            </span>
          </div>

          <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white divide-y divide-neutral-100">
            
            {/* 1. Location Tagger Row */}
            <div className="p-1">
              <button
                type="button"
                onClick={() => setActivePicker(activePicker === "location" ? "none" : "location")}
                className="w-full flex items-center justify-between px-3.5 py-3 hover:bg-neutral-50 transition rounded-xl text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">Add Location</span>
                    <span className="text-[10px] text-neutral-400 block">Tag where your update was made</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedLocation ? (
                    <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                      📍 {selectedLocation}
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-400 font-medium">None</span>
                  )}
                </div>
              </button>

              {activePicker === "location" && (
                <div className="p-3 bg-neutral-50/50 border-t border-neutral-100 flex flex-wrap gap-1.5">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSelectedLocation(selectedLocation === loc ? "" : loc);
                        setActivePicker("none");
                      }}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                        selectedLocation === loc 
                          ? "bg-sky-100 text-sky-800 border-sky-300 font-bold" 
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                  {selectedLocation && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLocation("");
                        setActivePicker("none");
                      }}
                      className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-semibold"
                    >
                      Clear Tag
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 2. Mood Check-in Row */}
            <div className="p-1">
              <button
                type="button"
                onClick={() => setActivePicker(activePicker === "mood" ? "none" : "mood")}
                className="w-full flex items-center justify-between px-3.5 py-3 hover:bg-neutral-50 transition rounded-xl text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Smile className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">Check-in Mood</span>
                    <span className="text-[10px] text-neutral-400 block">Attach your current feeling</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedMood ? (
                    <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full font-mono">
                      {selectedMood}
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-400 font-medium">None</span>
                  )}
                </div>
              </button>

              {activePicker === "mood" && (
                <div className="p-3 bg-neutral-50/50 border-t border-neutral-100 flex flex-wrap gap-1.5">
                  {MOODS.map((md) => {
                    const labelStr = `${md.emoji} ${md.label}`;
                    return (
                      <button
                        key={md.label}
                        type="button"
                        onClick={() => {
                          setSelectedMood(selectedMood === labelStr ? "" : labelStr);
                          setActivePicker("none");
                        }}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                          selectedMood === labelStr 
                            ? "bg-amber-100 text-amber-900 border-amber-300 font-bold" 
                            : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        {labelStr}
                      </button>
                    );
                  })}
                  {selectedMood && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMood("");
                        setActivePicker("none");
                      }}
                      className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-semibold"
                    >
                      Clear Mood
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 3. Sticker Overlay Row */}
            <div className="p-1">
              <button
                type="button"
                onClick={() => setActivePicker(activePicker === "sticker" ? "none" : "sticker")}
                className="w-full flex items-center justify-between px-3.5 py-3 hover:bg-neutral-50 transition rounded-xl text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">Sticker Badge</span>
                    <span className="text-[10px] text-neutral-400 block">Pin an action sticker to your feed card</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedSticker ? (
                    <span className="text-xs font-black text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full">
                      {selectedSticker.split(" ").slice(1).join(" ") || selectedSticker}
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-400 font-medium">None</span>
                  )}
                </div>
              </button>

              {activePicker === "sticker" && (
                <div className="p-3 bg-neutral-50/50 border-t border-neutral-100 flex flex-wrap gap-1.5">
                  {STICKERS.map((st) => (
                    <button
                      key={st.value}
                      type="button"
                      onClick={() => {
                        setSelectedSticker(selectedSticker === st.value ? "" : st.value);
                        setActivePicker("none");
                      }}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                        selectedSticker === st.value 
                          ? "bg-violet-100 text-violet-900 border-violet-300 font-bold" 
                          : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                  {selectedSticker && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSticker("");
                        setActivePicker("none");
                      }}
                      className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-semibold"
                    >
                      Clear Sticker
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 4. Significant Milestone Toggle Row */}
            <div className="p-1 px-3.5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                  isMilestone ? "bg-amber-100 text-amber-700" : "bg-neutral-100 text-neutral-500"
                }`}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-800 block">Milestone Update</span>
                  <span className="text-[10px] text-neutral-400 block">Highlight this post with a premium badge</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMilestone(!isMilestone)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 shrink-0 ${
                  isMilestone ? "bg-amber-500" : "bg-neutral-200"
                }`}
                aria-label="Toggle milestone state"
              >
                <div className={`h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  isMilestone ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>

          </div>

          {/* 5. Stage Synchronization (Only shown if journey exists) */}
          {journeyId && (
            <div className="space-y-2 p-4 bg-sky-50/50 border border-sky-100/70 rounded-2xl">
              <div className="flex items-center gap-1.5 text-sky-800 text-xs font-bold">
                <Check className="h-4 w-4 text-sky-600" />
                Journey Progress Stage (Optional)
              </div>
              <p className="text-[10px] text-sky-600 leading-normal">
                Entering a new stage label here will automatically rename your active checkpoint stage.
              </p>
              <input
                type="text"
                value={syncStageText}
                onChange={(e) => setSyncStageText(e.target.value)}
                placeholder="e.g. Week 2: Prototype Finished 🎨"
                className="w-full text-xs font-semibold bg-white border border-sky-200/80 rounded-xl px-3 py-2.5 outline-none focus:border-sky-400 text-neutral-800"
              />
            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* MAIN SUBMIT BUTTON */}
        {/* ========================================================= */}
        <button
          onClick={handlePost}
          disabled={isFormInvalid}
          className="w-full rounded-2xl bg-neutral-950 py-3.5 text-xs font-bold uppercase tracking-widest text-white disabled:opacity-45 hover:bg-neutral-800 active:scale-[0.99] transition shadow-lg mt-2 flex items-center justify-center gap-2"
        >
          <Layers className="h-4 w-4" />
          {ctaLabel}
        </button>

      </div>
    </div>
  );
}
