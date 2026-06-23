import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
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
  const { getJourney, isOwned, isFollowing, isCompleted, toggleFollow, deleteJourney, isFollowingUser, toggleFollowUser } = useApp();
  const j = getJourney(id);
  const [menu, setMenu] = useState(false);
  const [ai, setAi] = useState(false);
  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
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
  const followingUser = isFollowingUser(j.owner);
  const completed = isCompleted(j.id);

  return (
    <PhoneFrame>
      {/* Sleek Custom Sticky Navigation Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-100 bg-white/95 px-4 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <BackButton onClick={() => navigate({ to: getLastMainRoute() })} />
          <span className="text-sm font-bold text-neutral-900">Journey details</span>
        </div>
        {owner ? (
          <div className="relative">
            <button
              onClick={() => setMenu((v) => !v)}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-neutral-100 transition"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5 text-neutral-600" />
            </button>
            {menu ? (
              <div className="absolute right-0 top-9 z-30 w-48 overflow-hidden rounded-2xl border border-neutral-200 bg-white text-xs shadow-xl">
                <MenuItem onClick={() => setMenu(false)}>Archive</MenuItem>
                <MenuItem onClick={() => setMenu(false)}>Pause</MenuItem>
                <MenuItem
                  onClick={() => {
                    setMenu(false);
                    navigate({ to: `/journey/${j.id}/complete` });
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
                    <Trash2 className="mr-1.5 inline h-3.5 w-3.5" /> Delete journey
                  </span>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setMenu(false);
                    navigate({ to: `/journey/${j.id}/settings` });
                  }}
                >
                  <SettingsIcon className="mr-1.5 inline h-3.5 w-3.5 text-neutral-500" /> Journey settings
                </MenuItem>
              </div>
            ) : null}
          </div>
        ) : null}
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Optional Highlights Slider */}
        {j.highlight && j.highlight.images.length ? (
          <div className="border-b border-neutral-100 px-3 py-3 bg-neutral-50/20">
            <div className="mb-2 flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">
                Key Highlights
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
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
                    className="h-12 w-12 rounded-full border-2 border-white object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Dense and Compact Details Panel */}
        <div className="px-4 py-4 bg-white border-b border-neutral-100">
          <div className="space-y-2">
            
            {/* Creator Avatar Badge (only shown if not owner) */}
            {!owner && (
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={j.ownerAvatar}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover border border-neutral-200"
                />
                <div className="min-w-0 flex-1 flex items-center gap-1.5">
                  <span className="text-xs font-bold text-neutral-800">@{j.owner}</span>
                  <button
                    onClick={() => toggleFollowUser(j.owner)}
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition ${
                      followingUser 
                        ? "bg-neutral-100 text-neutral-600" 
                        : "bg-sky-50 text-sky-600"
                    }`}
                  >
                    {followingUser ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            )}

            {/* Title & Complete Badge */}
            <div className="flex items-start gap-2.5">
              <h1 className="text-lg font-extrabold tracking-tight text-neutral-900 leading-snug flex-1">
                {j.title}
              </h1>
              {completed && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-extrabold text-amber-800 border border-amber-200/50 uppercase tracking-wider shrink-0 mt-0.5">
                  Completed
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-500 leading-relaxed font-normal">
              {j.description}
            </p>

            {/* Mini Horizontal Grid of Meta & Stage */}
            <div className="pt-2.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-y-2 text-[10px] text-neutral-500 font-semibold">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Started <strong className="text-neutral-800">{j.startDate}</strong></span>
                <span className="text-neutral-300">•</span>
                <span>Period <strong className="text-neutral-800">{j.timeline}</strong></span>
                <span className="text-neutral-300">•</span>
                <span>Followers <strong className="text-neutral-800">{j.followers}</strong></span>
              </div>
              
              {j.stage && (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50/70 border border-amber-100 rounded-md px-1.5 py-0.5 font-bold truncate max-w-[160px]">
                  <Sparkles className="h-3 w-3 text-amber-500 shrink-0" /> {j.stage}
                </span>
              )}
            </div>

            {/* Primary Action Row */}
            <div className="pt-2 flex gap-2">
              <Link
                to={`/journey/${j.id}/story` as any}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 active:scale-[0.99] transition shadow-xs"
              >
                <PlayCircle className="h-3.5 w-3.5 text-neutral-500" /> Play Story
              </Link>
              {owner ? (
                <Link
                  to={`/journey/${j.id}/add` as any}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 py-2 text-xs font-bold text-white hover:bg-neutral-900 active:scale-[0.99] transition shadow-md"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Add Update
                </Link>
              ) : (
                <button
                  onClick={() => toggleFollow(j.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition active:scale-[0.99] ${
                    following 
                      ? "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50" 
                      : "bg-neutral-950 text-white hover:bg-neutral-900 shadow-md"
                  }`}
                >
                  {following ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Following
                    </span>
                  ) : (
                    "Follow along"
                  )}
                </button>
              )}
            </div>

            {owner && (
              <div className="flex justify-end pt-0.5">
                <button
                  onClick={() => setAi(true)}
                  className="inline-flex items-center gap-1 text-[10px] font-extrabold text-violet-700 hover:underline"
                >
                  <Sparkles className="h-3 w-3 text-violet-600" /> Spark Inspiration
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Timeline Posts List */}
        <div className="bg-neutral-50/50">
          <h2 className="px-4 pt-5 pb-2 text-xs font-extrabold uppercase tracking-widest text-neutral-400">
            Timeline Feed
          </h2>
          <div className="divide-y divide-neutral-100 bg-white">
            {j.posts.map((p) => {
              const hasLiked = likedPosts[p.id];
              const finalLikes = p.likes + (hasLiked ? 1 : 0);

              return (
                <div key={p.id} className="py-5 border-b border-neutral-100 bg-white space-y-3">
                  {/* Post Card Header */}
                  <div className="px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={j.ownerAvatar}
                        alt=""
                        className="h-7 w-7 rounded-full object-cover border border-neutral-150"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-800">@{j.owner}</span>
                          {p.isStoryStyle && (
                            <span className="bg-pink-50 text-pink-600 border border-pink-200/50 text-[8px] font-black uppercase px-1 py-0.5 rounded tracking-wide scale-90">
                              Story
                            </span>
                          )}
                        </div>
                        {/* Tags list */}
                        <div className="flex flex-wrap items-center gap-1 mt-0.5">
                          <span className="text-[9px] text-neutral-400 font-medium">
                            {p.daysAgo === 0 ? "Just now" : `${p.daysAgo}d ago`}
                          </span>
                          {p.location && (
                            <>
                              <span className="text-neutral-300 text-[9px]">•</span>
                              <span className="text-[9px] font-bold text-sky-600 truncate max-w-[120px]">
                                📍 {p.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Badge stickers (Optional) */}
                    <div className="flex items-center gap-1">
                      {p.sticker && (
                        <span className="text-[9px] font-black text-violet-700 bg-violet-50/80 border border-violet-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {p.sticker.split(" ").slice(1).join(" ") || p.sticker}
                        </span>
                      )}
                      {p.mood && (
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-50/80 border border-amber-100 px-1.5 py-0.5 rounded font-mono">
                          {p.mood.split(" ")[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Primary Visual Media Area */}
                  {(((p.type === "photo" || p.type === "video") && p.url) || p.isStoryStyle) ? (
                    <div className="px-4">
                      {p.type === "photo" && p.url ? (
                        <div 
                          onClick={() => setOpenPost(p)}
                          className="relative aspect-square w-full rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-900 shadow-xs cursor-pointer group"
                        >
                          <img 
                            src={p.url} 
                            alt={p.caption} 
                            className="w-full h-full object-cover group-hover:scale-[1.015] transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </div>
                      ) : p.type === "video" && p.url ? (
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-neutral-100 bg-black shadow-xs">
                          <video 
                            src={p.url} 
                            poster={p.poster} 
                            controls 
                            playsInline 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ) : p.isStoryStyle && !p.url ? (
                        /* Fallback Story gradient block if no URL */
                        <div 
                          onClick={() => setOpenPost(p)}
                          className={`aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xs cursor-pointer flex flex-col items-center justify-center p-6 text-center ${p.storyBgStyle || "bg-gradient-to-tr from-pink-500 to-yellow-500"}`}
                        >
                          <p className="text-white text-sm font-extrabold px-4 drop-shadow-md">
                            {p.caption}
                          </p>
                          <span className="mt-2 text-white/90 text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                            Tap to view full story
                          </span>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Action Icons Panel */}
                  <div className="px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => setLikedPosts(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                        className="flex items-center justify-center transition-transform active:scale-90"
                        aria-label={hasLiked ? "Unlike post" : "Like post"}
                      >
                        <Heart 
                          className={`h-5 w-5 transition-colors ${
                            hasLiked 
                              ? "fill-red-500 text-red-500" 
                              : "text-neutral-700 hover:text-red-500"
                          }`} 
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenPost(p)}
                        className="flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-colors"
                        aria-label="Comment on post"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: p.caption, url: window.location.href }).catch(() => {});
                          } else {
                            alert("Copied link to clipboard!");
                          }
                        }}
                        className="flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-colors"
                        aria-label="Share post"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenPost(p)}
                      className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider hover:text-neutral-700"
                    >
                      View Comments
                    </button>
                  </div>

                  {/* Likes and Caption Texts */}
                  <div className="px-4 space-y-1">
                    {finalLikes > 0 && (
                      <p className="text-xs font-extrabold text-neutral-800">
                        {finalLikes.toLocaleString()} {finalLikes === 1 ? "like" : "likes"}
                      </p>
                    )}
                    
                    <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                      <span className="font-extrabold mr-1.5">@{j.owner}</span>
                      {p.caption}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header - Adaptive for story vs post */}
        <header className="flex items-center justify-between border-b border-neutral-100 px-3.5 py-3 bg-white">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full p-[1.5px] ${post.isStoryStyle ? "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500" : "bg-neutral-200"}`}>
              <img
                src={journey.ownerAvatar}
                alt=""
                className="h-full w-full rounded-full object-cover border border-white"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-900 block leading-none">{journey.owner}</span>
              {post.location && (
                <span className="text-[10px] text-sky-700 font-semibold block mt-0.5">
                  📍 {post.location}
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close"
            className="p-1 rounded-full hover:bg-neutral-100 transition"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-neutral-50">
          
          {post.isStoryStyle ? (
            /* ======================================================== */
            /* DEEP IMMERSIVE STORY GRAPHIC VIEW */
            /* ======================================================== */
            <div className="p-3 bg-neutral-100">
              <div className="aspect-[9/16] w-full max-w-[280px] mx-auto rounded-3xl bg-black relative overflow-hidden flex flex-col justify-between p-4 shadow-lg">
                
                {/* Story header progress bars */}
                <div className="absolute top-2 inset-x-3 flex gap-0.5 z-10">
                  <div className="h-[2px] bg-white/50 flex-1 rounded-sm overflow-hidden">
                    <div className="h-full bg-white/90 w-full" />
                  </div>
                  <div className="h-[2px] bg-white/20 flex-1 rounded-sm" />
                </div>

                {/* Sub-header inside story view */}
                <div className="absolute top-4 inset-x-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-slate-200 overflow-hidden">
                      <img src={journey.ownerAvatar} alt="" className="h-full w-full object-cover" />
                    </div>
                    <span className="text-[9px] font-bold text-white shadow-xs">{journey.owner}</span>
                  </div>
                  <span className="bg-pink-600 text-[8px] uppercase px-1.5 py-0.5 rounded text-white font-black tracking-widest">
                    Quick Story Style
                  </span>
                </div>

                {/* Background media */}
                <div className="absolute inset-0 z-0">
                  {post.type === "photo" && post.url ? (
                    <img src={post.url} alt="" className="w-full h-full object-cover" />
                  ) : post.type === "video" && post.url ? (
                    <video
                      src={post.url}
                      poster={post.poster}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full ${post.storyBgStyle || "bg-gradient-to-tr from-pink-500 to-yellow-500"}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/55" />
                </div>

                {/* Floating Sticker inside Story */}
                <div className="z-10 mt-16 flex justify-center">
                  {post.sticker && (
                    <div className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-md border border-white/40 transform -rotate-2">
                      <span className="text-[9px] font-black text-neutral-800 uppercase tracking-widest leading-none">
                        {post.sticker}
                      </span>
                    </div>
                  )}
                </div>

                {/* Overlay Caption Text */}
                <div className="z-10 mb-4 flex justify-center w-full px-1">
                  <div 
                    className="w-full text-center px-3 py-2.5 rounded-2xl bg-black/65 backdrop-blur-md border border-white/5 text-[11px] font-normal leading-relaxed shadow-lg break-words"
                    style={{ color: post.storyTextColor || "#ffffff" }}
                  >
                    {post.caption}
                  </div>
                </div>

              </div>
              
              <div className="mt-3 text-center">
                <span className="inline-block px-2.5 py-1 bg-pink-50 border border-pink-100 rounded-full font-bold text-[10px] text-pink-600 uppercase tracking-widest">
                  📸 Story view simulation
                </span>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* STANDARD / ELABORATE DETAILED FEED POST VIEW */
            /* ======================================================== */
            <>
              {post.type === "photo" && post.url ? (
                <img src={post.url} alt="" className="aspect-square w-full object-cover bg-white" />
              ) : post.type === "video" && post.url ? (
                <video
                  src={post.url}
                  poster={post.poster}
                  controls
                  playsInline
                  className="aspect-square w-full bg-black object-contain"
                />
              ) : (
                <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/20 p-8 text-center text-sm font-semibold text-neutral-800 border-b border-neutral-100">
                  {post.caption}
                </div>
              )}
            </>
          )}

          {/* Social Feedback Bar */}
          <div className="bg-white">
            <div className="flex items-center gap-4 px-3.5 pt-3">
              <button onClick={() => setLiked((v) => !v)} className="hover:scale-110 active:scale-95 transition">
                <Heart
                  className={"h-6 w-6 " + (liked ? "text-red-500" : "text-neutral-900")}
                  fill={liked ? "currentColor" : "none"}
                  strokeWidth={1.8}
                />
              </button>
              <MessageCircle className="h-6 w-6 text-neutral-900 hover:scale-110 transition" strokeWidth={1.8} />
              <Send className="h-6 w-6 text-neutral-900 hover:scale-110 transition" strokeWidth={1.8} />
            </div>
            
            <div className="px-3.5 pt-2 text-xs font-bold text-neutral-900">
              {likes.toLocaleString()} likes
            </div>

            {/* In-feed descriptions */}
            <div className="px-3.5 pb-3 pt-1 border-b border-neutral-50">
              {/* If mood tag exists, display mood status */}
              {post.mood && (
                <p className="mb-2 text-[10px] font-bold text-amber-700 bg-amber-50 rounded-md px-2 py-1 inline-block">
                  Current Feeling: {post.mood}
                </p>
              )}

              {post.type !== "text" ? (
                <p className="text-xs text-neutral-800 leading-relaxed">
                  <span className="font-extrabold text-neutral-900 mr-1.5">{journey.owner}</span> 
                  {post.caption}
                </p>
              ) : null}

              <p className="mt-1.5 text-[9px] font-semibold text-neutral-400 uppercase tracking-wider">
                {post.daysAgo === 0 ? "Just now" : `${post.daysAgo}d ago`} · {journey.title} update
              </p>
            </div>

            {/* Comments thread wrapper */}
            {comments.length > 0 && (
              <div className="px-3.5 py-3 bg-neutral-50/50 space-y-1.5 border-t border-neutral-100/40">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block">
                  Comments
                </span>
                {comments.map((c, i) => (
                  <p key={i} className="text-xs text-neutral-700">
                    <span className="font-bold text-neutral-900 mr-1.5">{c.user}</span> 
                    {c.text}
                  </p>
                ))}
              </div>
            )}
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
          className="flex items-center gap-2 border-t border-neutral-100 px-3.5 py-3 bg-white shrink-0"
        >
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-neutral-400 text-neutral-800"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="text-xs font-bold text-sky-600 disabled:opacity-40 hover:text-sky-800 transition"
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