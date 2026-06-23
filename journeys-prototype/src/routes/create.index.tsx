import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Film,
  Music2,
  Sliders,
  Type,
  Plus,
  Compass,
  ArrowRight,
  Smile,
  MapPin,
  Camera,
  Layers,
  Heart,
  Volume2,
  Calendar,
  Clock,
  Check,
  ChevronDown,
  RefreshCw,
  Sparkle
} from "lucide-react";
import { PhoneFrame } from "../components/PhoneFrame";
import { BottomTabs } from "../components/BottomTabs";
import { useApp } from "../state/AppState";
import { COVER_OPTIONS, inferTheme, CURRENT_USER, type Journey } from "../data/mock";

export const Route = createFileRoute("/create/")({
  head: () => ({ meta: [{ title: "Create · Glimpse" }] }),
  component: CreatePage,
});

// Curated Unsplash images representing creative topics for high-fidelity Mock Gallery
const AESTHETIC_TEMPLATES = [
  { id: "t1", url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80", label: "Running" },
  { id: "t2", url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80", label: "Golf" },
  { id: "t3", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80", label: "Baking" },
  { id: "t4", url: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=80", label: "Reading" },
  { id: "t5", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80", label: "Travel" },
  { id: "t6", url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80", label: "Parenting" },
  { id: "t7", url: "https://images.unsplash.com/photo-1493106819501-66d381c466f1?auto=format&fit=crop&w=800&q=80", label: "Pottery" },
  { id: "t8", url: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80", label: "Piano" },
];

const REEL_VIDEOS = [
  { id: "v1", url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", poster: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb" },
  { id: "v2", url: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4", poster: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
  { id: "v3", url: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4", poster: "https://images.unsplash.com/photo-1528127269322-539801943592" }
];

const STORY_GRADIENTS = [
  "from-pink-500 via-red-500 to-yellow-500", // Classic Sunset
  "from-indigo-600 via-purple-600 to-pink-500", // Neon Galaxy
  "from-cyan-500 via-teal-500 to-emerald-500", // Aquatic Cool
  "from-fuchsia-600 to-rose-600", // Barbie Dream
  "from-emerald-800 via-neutral-900 to-black", // Jungle Night
];

const MUSIC_TRACKS = [
  { id: "m1", title: "Cruel Summer", artist: "Taylor Swift", duration: "0:15" },
  { id: "m2", title: "Lo-Fi Cooking Loops", artist: "Kitchen Beats", duration: "0:15" },
  { id: "m3", title: "Summer Breeze", artist: "Sunset Club", duration: "0:15" },
  { id: "m4", title: "Morning Dew", artist: "Wellness Sounds", duration: "0:15" },
];

const FILTERS = [
  { id: "f-normal", label: "Natural", style: "none" },
  { id: "f-retro", label: "Vintage 1993", style: "sepia(0.4) contrast(1.1) brightness(0.95)" },
  { id: "f-noir", label: "Noir", style: "grayscale(1) contrast(1.2)" },
  { id: "f-warm", label: "Golden Hour", style: "saturate(1.4) hue-rotate(-10deg)" },
  { id: "f-cyan", label: "Neon Cyber", style: "hue-rotate(180deg) saturate(1.2)" },
];

function CreatePage() {
  const navigate = useNavigate();
  const { journeys, isOwned, addPost, createJourney } = useApp();

  // Active creations state
  const [activeMode, setActiveMode] = useState<"POST" | "STORY" | "REEL" | "JOURNEY">("POST");

  // General App Data - fetch owned journeys to select which one to post to
  const myJourneys = journeys.filter((j) => isOwned(j.id));
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(myJourneys[0]?.id ?? "personal");

  // Success Pop-ups Indicators
  const [hudMessage, setHudMessage] = useState<string | null>(null);

  // 1. POST STATE
  const [postImage, setPostImage] = useState<string>(AESTHETIC_TEMPLATES[0].url);
  const [postCaption, setPostCaption] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. STORY STATE
  const [gradientIdx, setGradientIdx] = useState<number>(0);
  const [storyText, setStoryText] = useState<string>("Working on my progress today! 🌟");
  const [storyFont, setStoryFont] = useState<"classic" | "neon" | "serif" | "typewriter">("classic");
  const [stickerType, setStickerType] = useState<"question" | "countdown" | "prompt" | "none">("prompt");
  const [stickerPrompt, setStickerPrompt] = useState<string>("Show me your small win today!");
  const [stickerQuestion, setStickerQuestion] = useState<string>("Any advice on golf hip rotation?");

  // 3. REEL STATE
  const [reelVideoIdx, setReelVideoIdx] = useState<number>(0);
  const [selectedMusic, setSelectedMusic] = useState<string>("m1");
  const [activeFilter, setActiveFilter] = useState<string>("f-normal");
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [reelCaption, setReelCaption] = useState<string>("");

  // 4. JOURNEY STATE
  const [jTitle, setJTitle] = useState("");
  const [jDesc, setJDesc] = useState("");
  const [jTimeline, setJTimeline] = useState("");
  const [jCover, setJCover] = useState<string>(COVER_OPTIONS[0]);

  // Effects for auto-tagging
  const jTheme = inferTheme(`${jTitle} ${jDesc}`);

  // Display HUD Helper
  const triggerHUD = (message: string) => {
    setHudMessage(message);
    setTimeout(() => {
      setHudMessage(null);
    }, 2500);
  };

  // NATIVE FILE UPLOADER HELPER
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (activeMode === "POST") {
      setPostImage(url);
    } else if (activeMode === "JOURNEY") {
      setJCover(url);
    }
    triggerHUD("Image uploaded successfully!");
  };

  // POST SUBMISSION
  const handleSharePost = () => {
    if (selectedJourneyId === "personal") {
      triggerHUD("Shared to personal feed!");
      setTimeout(() => {
        navigate({ to: "/" });
      }, 1000);
      return;
    }

    const newPostObj = {
      id: "u-" + Math.random().toString(36).slice(2, 8),
      type: "photo" as const,
      url: postImage,
      caption: postCaption || "Progress update 📈",
      daysAgo: 0,
      likes: 0,
    };

    addPost(selectedJourneyId, newPostObj);
    triggerHUD("Post added to Journey!");
    setTimeout(() => {
      // Navigate to the target journey index
      navigate({ to: `/journey/${selectedJourneyId}` as any });
    }, 1200);
  };

  // STORY SUBMISSION
  const handleShareStory = () => {
    triggerHUD("Added to your Daily Story!");
    setTimeout(() => {
      navigate({ to: "/" });
    }, 1500);
  };

  // REEL SUBMISSION
  const handleShareReel = () => {
    // Treat as personal standard post with a video format
    if (selectedJourneyId !== "personal") {
      const selectedVid = REEL_VIDEOS[reelVideoIdx];
      const newPostObj = {
        id: "reel-" + Math.random().toString(36).slice(2, 8),
        type: "video" as const,
        url: selectedVid.url,
        poster: selectedVid.poster,
        caption: reelCaption || "New Reel vibes! 🎬",
        daysAgo: 0,
        likes: 0,
      };
      addPost(selectedJourneyId, newPostObj);
      triggerHUD("Reel posted to Journey!");
    } else {
      triggerHUD("Reel posted to personal reels!");
    }
    setTimeout(() => {
      navigate({ to: "/reels" });
    }, 1200);
  };

  // JOURNEY INLINE SUBMISSION
  const handleCreateJourney = () => {
    if (!jTitle.trim()) {
      triggerHUD("Please enter a Title");
      return;
    }
    const newId = "j-" + Math.random().toString(36).slice(2, 8);
    const mockJourney: Journey = {
      id: newId,
      title: jTitle,
      description: jDesc || "A brand new journey documented step by step.",
      theme: jTheme,
      stage: "Day 1",
      followers: 0,
      startDate: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      timeline: jTimeline || "ongoing",
      cover: jCover,
      owner: CURRENT_USER.username,
      ownerAvatar: CURRENT_USER.avatar,
      posts: [
        {
          id: "p-start",
          type: "text",
          caption: `Just launched my journey: "${jTitle}"! Committing to tracing and detailing my path publicly. Let's do this.`,
          daysAgo: 0,
          likes: 0,
        },
      ],
    };

    createJourney(mockJourney);
    triggerHUD("Journey created successfully!");
    setTimeout(() => {
      navigate({ to: "/profile" });
    }, 1200);
  };

  return (
    <PhoneFrame>
      <div className="relative flex flex-1 flex-col overflow-hidden bg-neutral-950 font-sans text-white">
        
        {/* NATIVE HUD NOTIFICATION */}
        {hudMessage && (
          <div className="absolute top-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/85 px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-lg ring-1 ring-white/10 transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {hudMessage}
            </div>
          </div>
        )}

        {/* NATIVE INSTAGRAM-STYLE BLACK HEADER BAR */}
        <header className="flex h-14 shrink-0 items-center justify-between px-4 ring-1 ring-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/" })}
              className="text-neutral-300 hover:text-white transition"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <span className="font-semibold text-base tracking-tight font-sans">
              Create
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-sky-500">
            {activeMode === "POST" && (
              <button
                onClick={handleSharePost}
                className="rounded-full bg-sky-500 px-4 py-1.5 font-bold text-white shadow-md active:scale-95 transition"
              >
                Share
              </button>
            )}
            {activeMode === "STORY" && (
              <button
                onClick={handleShareStory}
                className="rounded-full bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 px-4 py-1.5 font-bold text-white shadow-md active:scale-95 transition"
              >
                Post Story
              </button>
            )}
            {activeMode === "REEL" && (
              <button
                onClick={handleShareReel}
                className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-1.5 font-bold text-white shadow-md active:scale-95 transition"
              >
                Post Reel
              </button>
            )}
            {activeMode === "JOURNEY" && (
              <button
                onClick={handleCreateJourney}
                className="rounded-full bg-emerald-500 px-4 py-1.5 font-bold text-white shadow-md active:scale-95 transition"
              >
                Launch
              </button>
            )}
          </div>
        </header>

        {/* INNER SCROLL FOR CONTENT PREVIEW + BUILDERS */}
        <main className="flex-1 overflow-y-auto px-4 pb-28">
          
          {/* ======================= POST MODE BUILDER ======================= */}
          {activeMode === "POST" && (
            <div className="flex flex-col gap-4 py-3">
              {/* Media Preview Box */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 shadow-2xl">
                <img
                  src={postImage}
                  alt="Post preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold backdrop-blur-md ring-1 ring-white/10 hover:bg-black/80 transition"
                >
                  <Camera className="h-3.5 w-3.5" />
                  Upload Custom
                </button>
              </div>

              {/* Curated Aesthetic templates Row */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                  Select Visual Template
                </label>
                <div className="mt-1.5 flex gap-2 overflow-x-auto pb-2">
                  {AESTHETIC_TEMPLATES.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setPostImage(item.url)}
                      className={
                        "relative flex h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-800 transition ring-1 active:scale-95 " +
                        (postImage === item.url ? "ring-sky-500 ring-2" : "ring-white/10")
                      }
                    >
                      <img src={item.url} alt="" className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 py-0.5 text-center text-[8px] font-medium leading-none truncate">
                        {item.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Journey Select Row */}
              <div className="rounded-2xl bg-neutral-900 border border-white/5 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-neutral-300">Add directly to Journey</span>
                    <span className="text-[10px] text-neutral-500">Post update inside a progress tracker</span>
                  </div>
                  <div className="relative">
                    <select
                      value={selectedJourneyId}
                      onChange={(e) => setSelectedJourneyId(e.target.value)}
                      className="appearance-none bg-neutral-800 text-xs text-white px-3 py-1.5 pr-8 rounded-lg outline-none cursor-pointer ring-1 ring-white/10 hover:bg-neutral-700 font-semibold"
                    >
                      <option value="personal">Personal Feed Only</option>
                      {myJourneys.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Caption Box */}
              <div className="flex gap-3 rounded-2xl bg-neutral-900 border border-white/5 p-3">
                <img
                  src={CURRENT_USER.avatar}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover"
                />
                <div className="flex-1">
                  <label htmlFor="create-post-caption" className="sr-only">Progress update details</label>
                  <textarea
                    id="create-post-caption"
                    rows={4}
                    value={postCaption}
                    onChange={(e) => setPostCaption(e.target.value)}
                    placeholder="Write a progress update details... (e.g. Completed today's workout! Feeling fantastic! #progress)"
                    className="w-full resize-none bg-transparent text-sm text-neutral-200 placeholder-neutral-500 outline-none"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-neutral-400 border-t border-white/5 pt-2">
                    <div className="flex gap-3">
                      <button className="flex items-center gap-1 hover:text-white transition">
                        <MapPin className="h-3.5 w-3.5 text-sky-400" />
                        Location
                      </button>
                      <button className="flex items-center gap-1 hover:text-white transition">
                        <Smile className="h-3.5 w-3.5 text-yellow-400" />
                        Mood
                      </button>
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      {postCaption.length} characters
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ======================= STORY MODE BUILDER ======================= */}
          {activeMode === "STORY" && (
            <div className="flex flex-col gap-4 py-3">
              {/* Vertical Story Display Canvas */}
              <div
                className={`relative aspect-[9/16] w-full overflow-hidden rounded-3xl bg-gradient-to-br ${STORY_GRADIENTS[gradientIdx]} ring-1 ring-white/15 shadow-2xl p-6 flex flex-col justify-between`}
              >
                {/* Story Top bar */}
                <div className="flex items-center justify-between">
                  {/* User profile layout */}
                  <div className="flex items-center gap-2">
                    <img
                      src={CURRENT_USER.avatar}
                      alt=""
                      className="h-8 w-8 rounded-full border border-white/40 object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold font-sans">your_story</span>
                      <span className="text-[8px] tracking-widest opacity-75">JUST NOW</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setGradientIdx((gradientIdx + 1) % STORY_GRADIENTS.length)}
                      className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition"
                      title="Change background gradient"
                    >
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Main Content Area - Text Tool Placement */}
                <div className="my-auto flex flex-col items-center justify-center text-center p-4">
                  <div
                    className={
                      "text-xl p-4 font-bold max-w-xs transition-all tracking-wide leading-relaxed shadow-lg " +
                      (storyFont === "classic"
                        ? "font-sans text-white uppercase text-2xl"
                        : storyFont === "neon"
                        ? "font-mono text-pink-300 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]"
                        : storyFont === "serif"
                        ? "font-serif italic text-amber-50 text-2xl font-semibold"
                        : "font-mono bg-white text-black p-3.5 rounded-lg border-2 border-black tracking-normal text-sm")
                    }
                  >
                    "{storyText}"
                  </div>

                  {/* Dynamic sticker overlay */}
                  {stickerType !== "none" && (
                    <div className="mt-6 w-full max-w-[240px] animate-fade-in">
                      {stickerType === "prompt" && (
                        <div className="rounded-2xl bg-white/95 text-black p-3.5 shadow-xl text-center border border-white/20 select-none">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 mb-1.5">
                            <Sparkle className="h-2.5 w-2.5 fill-white" />
                            Add Yours
                          </div>
                          <p className="text-xs font-extrabold tracking-tight px-1 leading-tight">
                            {stickerPrompt}
                          </p>
                          <div className="mt-2.5 flex justify-center -space-x-1.5">
                            <span className="h-4 w-4 rounded-full bg-purple-400 border border-white text-[7px] text-white flex items-center justify-center font-bold">A</span>
                            <span className="h-4 w-4 rounded-full bg-blue-400 border border-white text-[7px] text-white flex items-center justify-center font-bold">B</span>
                            <span className="h-4 w-4 rounded-full bg-rose-400 border border-white text-[7px] text-white flex items-center justify-center font-bold">C</span>
                          </div>
                          <p className="mt-1 text-[8px] text-neutral-500 font-semibold uppercase tracking-wider">
                            Participate
                          </p>
                        </div>
                      )}

                      {stickerType === "question" && (
                        <div className="rounded-2xl bg-white text-neutral-900 border border-neutral-100 p-3.5 shadow-2xl text-center select-none font-sans">
                          <div className="bg-sky-500 text-white text-[9px] font-bold px-3 py-1 rounded-full inline-block uppercase tracking-wider mb-2">
                            Ask me a Question
                          </div>
                          <p className="text-xs font-bold leading-tight select-none">
                            {stickerQuestion}
                          </p>
                          <div className="mt-3 bg-neutral-50 border border-neutral-100 rounded-xl p-2.5 text-[10px] text-neutral-400 flex justify-between items-center">
                            <span>Type something...</span>
                            <span className="h-2 w-2 rounded-full bg-sky-500" />
                          </div>
                        </div>
                      )}

                      {stickerType === "countdown" && (
                        <div className="rounded-2xl bg-black/75 border border-white/10 text-white p-3.5 shadow-xl text-center backdrop-blur select-none">
                          <span className="text-[9px] font-bold text-pink-400 uppercase tracking-widest">
                            COUNTDOWN
                          </span>
                          <p className="text-xs font-bold tracking-tight mt-0.5 leading-tight">
                            Breaking 100 Goal!
                          </p>
                          <div className="mt-2 text-base font-mono font-semibold tracking-wider flex justify-center gap-2 text-white">
                            <span className="bg-white/10 px-2 py-0.5 rounded">03</span>:
                            <span className="bg-white/10 px-2 py-0.5 rounded">14</span>:
                            <span className="bg-white/10 px-2 py-0.5 rounded">22</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer status indicating story features */}
                <div className="mt-auto flex justify-between items-center bg-black/40 backdrop-blur-sm px-3 py-2 rounded-xl text-[10px]">
                  <span className="flex items-center gap-1 tracking-wider uppercase font-semibold text-neutral-300">
                    <Sliders className="h-3.5 w-3.5 text-pink-400" /> Custom overlays
                  </span>
                  <span className="text-neutral-400">Tap elements below to tweak</span>
                </div>
              </div>

              {/* Story editing widgets */}
              <div className="rounded-2xl bg-neutral-900 border border-white/5 p-4 flex flex-col gap-3">
                
                {/* 1. TEXT CONTROLLER */}
                <div>
                  <label htmlFor="create-story-text" className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">
                    Edit Text Overlay
                  </label>
                  <input
                    id="create-story-text"
                    type="text"
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    className="w-full bg-neutral-800 rounded-xl px-3 py-2 text-xs text-white border border-white/10 outline-none focus:border-white/20 font-medium"
                    placeholder="Type customized text overlay here..."
                  />
                </div>

                {/* 2. INSTAL-FONT PICKER */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1.5">
                    Select Font Preset
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {(["classic", "neon", "serif", "typewriter"] as const).map((font) => (
                      <button
                        key={font}
                        onClick={() => setStoryFont(font)}
                        className={
                          "py-1.5 text-[10px] rounded-lg font-bold border capitalize transition " +
                          (storyFont === font
                            ? "bg-white text-black border-white"
                            : "bg-neutral-800 text-neutral-400 border-white/10 hover:bg-neutral-700")
                        }
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. STICKER SELECTOR */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1.5">
                    Interactive Stickers
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { type: "prompt" as const, label: "Add Yours" },
                      { type: "question" as const, label: "Question" },
                      { type: "countdown" as const, label: "Timer" },
                      { type: "none" as const, label: "No Sticker" },
                    ].map((stickerOpt) => (
                      <button
                        key={stickerOpt.type}
                        onClick={() => setStickerType(stickerOpt.type)}
                        className={
                          "py-1.5 text-[10px] rounded-lg font-bold border transition " +
                          (stickerType === stickerOpt.type
                            ? "bg-pink-500 text-white border-pink-500"
                            : "bg-neutral-800 text-neutral-400 border-white/10 hover:bg-neutral-700")
                        }
                      >
                        {stickerOpt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sticker Custom Text field */}
                {stickerType === "prompt" && (
                  <div>
                    <label htmlFor="create-sticker-prompt" className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
                      Customize Prompt Title
                    </label>
                    <input
                      id="create-sticker-prompt"
                      type="text"
                      value={stickerPrompt}
                      onChange={(e) => setStickerPrompt(e.target.value)}
                      className="w-full bg-neutral-800/60 rounded-xl px-3 py-1.5 text-xs text-neutral-200 border border-white/10 outline-none"
                    />
                  </div>
                )}

                {stickerType === "question" && (
                  <div>
                    <label htmlFor="create-sticker-question" className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
                      Customize Question Box
                    </label>
                    <input
                      id="create-sticker-question"
                      type="text"
                      value={stickerQuestion}
                      onChange={(e) => setStickerQuestion(e.target.value)}
                      className="w-full bg-neutral-800/60 rounded-xl px-3 py-1.5 text-xs text-neutral-200 border border-white/10 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}


          {/* ======================= REEL MODE BUILDER ======================= */}
          {activeMode === "REEL" && (
            <div className="flex flex-col gap-4 py-3">
              {/* Aspect Ratio 9:16 Video Preview container */}
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl bg-black ring-1 ring-white/15 shadow-2xl">
                
                {/* Looping video container using custom filter styling */}
                <video
                  key={REEL_VIDEOS[reelVideoIdx].url}
                  src={REEL_VIDEOS[reelVideoIdx].url}
                  poster={REEL_VIDEOS[reelVideoIdx].poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ filter: FILTERS.find((f) => f.id === activeFilter)?.style ?? "none" }}
                  className="h-full w-full object-cover opacity-90 transition-all duration-300"
                />

                {/* Left floating camera options toolbar */}
                <div className="absolute left-3 top-20 z-20 flex flex-col items-center gap-3 bg-black/20 p-1.5 rounded-full backdrop-blur-md">
                  <button
                    onClick={() => setReelVideoIdx((reelVideoIdx + 1) % REEL_VIDEOS.length)}
                    className="p-2 bg-neutral-900/80 rounded-full hover:bg-neutral-800 transition shadow-lg border border-white/5"
                    title="Switch sample clip"
                  >
                    <RefreshCw className="h-4 w-4 text-white" />
                  </button>
                  <button
                    className="p-2 bg-neutral-900/80 rounded-full hover:bg-neutral-800 transition shadow-lg border border-white/5"
                    onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : prev === 2 ? 0.5 : 1))}
                    title="Change clip speed"
                  >
                    <span className="text-[10px] font-extrabold text-white">{speedMultiplier}x</span>
                  </button>
                  <button className="p-2 bg-neutral-900/80 rounded-full transition shadow-lg border border-white/5">
                    <Volume2 className="h-4 w-4 text-white" />
                  </button>
                </div>

                {/* Right Floating standard metrics indicators */}
                <div className="absolute right-3.5 bottom-16 z-20 flex flex-col items-center gap-4 text-white">
                  <div className="flex flex-col items-center">
                    <div className="h-9 w-9 rounded-full bg-black/40 border border-white/15 flex items-center justify-center backdrop-blur-sm">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[9px] font-bold mt-1">Like</span>
                  </div>
                  <div className="flex flex-col items-center animate-spin-slow">
                    <div className="h-8 w-8 rounded-full border border-white/50 bg-neutral-900 overflow-hidden shadow-lg p-0.5">
                      <img src={CURRENT_USER.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Bottom detail row */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-sky-500 text-white rounded-full p-1">
                      <Compass className="h-3 w-3" />
                    </span>
                    <span className="text-xs font-bold tracking-tight">reels_expert</span>
                  </div>
                  <p className="text-xs text-neutral-200">
                    {reelCaption || "Watch how I complete this training session step by step! #reels #hustle"}
                  </p>
                  
                  {/* Sliding audio tag */}
                  <div className="inline-flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full text-[9px] font-semibold text-neutral-300 max-w-[170px] border border-white/5">
                    <Music2 className="h-3 w-3 text-pink-400 shrink-0" />
                    <span className="truncate">
                      {MUSIC_TRACKS.find((m) => m.id === selectedMusic)?.title} · Original Sound
                    </span>
                  </div>
                </div>
              </div>

              {/* Reel customized adjustments controls */}
              <div className="rounded-2xl bg-neutral-900 border border-white/5 p-4 flex flex-col gap-3.5">
                
                {/* 1. REEL CAPTION BOX */}
                <div>
                  <label htmlFor="create-reel-caption" className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">
                    Reel Description
                  </label>
                  <input
                    id="create-reel-caption"
                    type="text"
                    value={reelCaption}
                    onChange={(e) => setReelCaption(e.target.value)}
                    className="w-full bg-neutral-800 rounded-xl px-3 py-2 text-xs text-white border border-white/10 outline-none focus:border-white/20 font-medium"
                    placeholder="Enter Reel caption (e.g. My 3 drills for breaking 100!)..."
                  />
                </div>

                {/* 2. AUDIO PICKER */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1.5">
                    Select Audio Track
                  </span>
                  <div className="flex flex-col gap-2">
                    {MUSIC_TRACKS.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => setSelectedMusic(track.id)}
                        className={
                          "flex items-center justify-between p-2.5 rounded-xl border text-left transition " +
                          (selectedMusic === track.id
                            ? "bg-white/10 border-white"
                            : "bg-neutral-800 border-white/5 text-neutral-300 hover:bg-neutral-700")
                        }
                      >
                        <div className="flex items-center gap-2">
                          <Music2 className="h-4 w-4 text-pink-400 shrink-0" />
                          <div>
                            <p className="text-xs font-bold leading-none">{track.title}</p>
                            <p className="text-[10px] text-neutral-400 mt-1">{track.artist}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono">{track.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. LENS FILTERS */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1.5">
                    Choose Filter Preset
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {FILTERS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        className={
                          "p-2 text-[10px] font-bold rounded-lg border text-center transition " +
                          (activeFilter === f.id
                            ? "bg-pink-500 text-white border-pink-500"
                            : "bg-neutral-800 text-neutral-400 border-white/10 hover:bg-neutral-700")
                        }
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target select for Reels */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1.5">
                    Select Journey to publish
                  </span>
                  <select
                    value={selectedJourneyId}
                    onChange={(e) => setSelectedJourneyId(e.target.value)}
                    className="w-full bg-neutral-800 text-xs text-white px-3 py-2.5 rounded-xl outline-none cursor-pointer ring-1 ring-white/10"
                  >
                    <option value="personal">Only to Reels Tab</option>
                    {myJourneys.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}


          {/* ======================= JOURNEY MODE BUILDER ======================= */}
          {activeMode === "JOURNEY" && (
            <div className="flex flex-col gap-4 py-3 animate-fade-in">
              <div className="rounded-2xl border border-white/10 bg-neutral-900 overflow-hidden shadow-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Commit to a Journey</h3>
                    <p className="text-[10px] text-neutral-400">Document a goal publicly over time.</p>
                  </div>
                </div>

                {/* 1. TITLE INPUT */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="create-journey-title" className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                    Journey Title
                  </label>
                  <input
                    id="create-journey-title"
                    type="text"
                    value={jTitle}
                    onChange={(e) => setJTitle(e.target.value)}
                    placeholder="e.g. Learning French language"
                    className="w-full bg-neutral-800 border border-white/5 rounded-xl p-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-medium"
                  />
                </div>

                {/* 2. DESCRIPTION TEXTAREA */}
                <div className="flex flex-col gap-1.5 mt-3">
                  <label htmlFor="create-journey-desc" className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                    Description
                  </label>
                  <textarea
                    id="create-journey-desc"
                    rows={3}
                    value={jDesc}
                    onChange={(e) => setJDesc(e.target.value)}
                    placeholder="Describe your goal. How often will you post? How will you know when you are finished?"
                    className="w-full bg-neutral-800 border border-white/5 rounded-xl p-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none leading-relaxed"
                  />
                </div>

                {/* Theme Auto-Tagged preview */}
                <div className="mt-2.5 inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[11px] font-semibold border border-emerald-500/20">
                  <Sparkle className="h-3 w-3 fill-emerald-400 text-emerald-400 shrink-0" />
                  Theme auto-detected: <span className="font-bold uppercase tracking-wide">{jTheme}</span>
                </div>

                {/* 3. EXPECTED TIMELINE */}
                <div className="flex flex-col gap-1.5 mt-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="create-journey-timeline" className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                      Expected Timeline
                    </label>
                    <span className="text-[9px] text-neutral-500 font-medium">e.g. "12 weeks", "by Dec", "Ongoing"</span>
                  </div>
                  <div className="relative">
                    <input
                      id="create-journey-timeline"
                      type="text"
                      value={jTimeline}
                      onChange={(e) => setJTimeline(e.target.value)}
                      placeholder="12 weeks"
                      className="w-full bg-neutral-800 border border-white/5 rounded-xl p-3 pl-10 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500 transition"
                    />
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  </div>
                </div>

                {/* 4. THEME COVER SELECTOR */}
                <div className="mt-4 border-t border-white/5 pt-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-2">
                    Select Cover Photo
                  </span>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {/* Custom upload button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-neutral-600 bg-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-400 hover:bg-neutral-700 transition"
                      aria-label="Upload custom cover photo"
                    >
                      <Plus className="h-5 w-5 mb-1" />
                      <span className="text-[8px] font-semibold uppercase leading-none">Upload</span>
                    </button>

                    {COVER_OPTIONS.map((c, i) => (
                      <button
                        key={c}
                        onClick={() => setJCover(c)}
                        className={
                          "relative aspect-square overflow-hidden rounded-xl border transition active:scale-95 " +
                          (jCover === c ? "border-emerald-500 ring-2 ring-emerald-500/30" : "border-white/5")
                        }
                      >
                        <img src={c} alt="" className="h-full w-full object-cover" />
                        {jCover === c && (
                          <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                            <Check className="h-6 w-6 text-emerald-400 drop-shadow-md" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hidden native input file for custom uploading */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </main>

        {/* NATIVE BOTTOM HORIZONTALLY SWIPEABLE BAR SELECTOR */}
        <div className="absolute bottom-16 inset-x-0 bg-black/90 p-3 flex flex-col items-center justify-center shrink-0 border-t border-white/5 backdrop-blur-md z-30">
          <div className="flex gap-7 px-4 justify-center">
            {[
              { mode: "POST" as const, label: "POST" },
              { mode: "STORY" as const, label: "STORY" },
              { mode: "REEL" as const, label: "REEL" },
              { mode: "JOURNEY" as const, label: "JOURNEY" },
            ].map((item) => (
              <button
                key={item.mode}
                onClick={() => {
                  setActiveMode(item.mode);
                  triggerHUD(`Switched to ${item.mode} mode`);
                }}
                className={
                  "text-xs tracking-[0.12em] font-extrabold focus:outline-none transition-all " +
                  (activeMode === item.mode
                    ? "text-white select-none scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                    : "text-neutral-500 hover:text-neutral-300")
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Dot Indicator under selected mode */}
          <div className="h-1 w-1 bg-white rounded-full mt-2 transition-all duration-300" />
        </div>

        <BottomTabs />
      </div>
    </PhoneFrame>
  );
}
