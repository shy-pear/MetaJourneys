import { useState, useEffect } from "react";
import { X, Heart, Sparkles, Check, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../state/AppState";
import { CURRENT_USER } from "../data/mock";

export const STORY_SLIDES = [
  {
    id: "story-1",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
    caption: "Day 1: picked up this old 1980s steel frame for $20! Let's see if we can restore this vintage ride 🚲",
    time: "12h ago",
  },
  {
    id: "story-2",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",
    caption: "Day 3: completely stripped of grease, sanded the old rust off, and prepped for primer. Sore hands but worth it! 💪",
    time: "8h ago",
  },
  {
    id: "story-3",
    image: "https://images.unsplash.com/photo-1507036066871-b7e8032b3dea?auto=format&fit=crop&w=600&q=80",
    caption: "Day 5: primer is dry and just laid the first coat of vintage celestial blue. Looking amazing! ✨",
    time: "2h ago",
  },
];

interface StoryViewerProps {
  onClose: () => void;
  onNavigateToJourney: (id: string) => void;
  slides?: { id: string; image: string; caption: string; time: string }[];
  isHighlightMode?: boolean;
  highlightName?: string;
  highlightId?: string;
  initialJourneyTitle?: string;
  initialJourneyDesc?: string;
  initialJourneyStage?: string;
  initialJourneyTheme?: string;
}

export function StoryViewer({ 
  onClose, 
  onNavigateToJourney,
  slides = STORY_SLIDES,
  isHighlightMode = false,
  highlightName = "",
  highlightId = "",
  initialJourneyTitle,
  initialJourneyDesc,
  initialJourneyStage,
  initialJourneyTheme = "Hobby & Maker"
}: StoryViewerProps) {
  const { addHighlight, deleteHighlight, createJourney } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Modals / Overlays state
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [newHighlightName, setNewHighlightName] = useState(highlightName);
  const [createdHighlightId, setCreatedHighlightId] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Conversion logic states
  const [showConversionPrompt, setShowConversionPrompt] = useState(false);
  const [showJourneySettings, setShowJourneySettings] = useState(false);

  // Settings for conversion
  const [journeyTitle, setJourneyTitle] = useState(initialJourneyTitle || "Vintage Bike Rebuild");
  const [journeyDesc, setJourneyDesc] = useState(initialJourneyDesc || "Restoring an old 1980s steel frame into a vintage celestial blue commuter bike. Step-by-step updates!");
  const [journeyStage, setJourneyStage] = useState(initialJourneyStage || "Week 1 · base coat prepped! 🎨");

  const [showSuccessSplash, setShowSuccessSplash] = useState(false);

  // 1. Timer / Auto-advance ticker
  useEffect(() => {
    if (isPaused || showHighlightModal || showConversionPrompt || showJourneySettings || showSuccessSplash) {
      return;
    }

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (currentSlide < slides.length - 1) {
            setCurrentSlide((cs) => cs + 1);
            return 0;
          } else {
            // Reached the end of stories without highlights, close
            clearInterval(interval);
            onClose();
            return 100;
          }
        }
        return p + 1; // 1% per tick (50ms interval = 5000ms = 5s total slide time)
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentSlide, isPaused, showHighlightModal, showConversionPrompt, showJourneySettings, showSuccessSplash, onClose, slides.length]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((cs) => cs + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((cs) => cs - 1);
      setProgress(0);
    }
  };

  // 2. Add to highlights handler
  const handleHighlightClick = () => {
    setIsPaused(true);
    setShowHighlightModal(true);
  };

  const handleCreateHighlight = () => {
    if (!newHighlightName.trim()) return;
    const cleanName = newHighlightName.trim();
    const hlId = `hl-${Date.now()}`;
    const coverUrl = slides[slides.length - 1]?.image || ""; // Last slide as cover

    // Add Highlight to AppState
    addHighlight(hlId, cleanName, coverUrl);
    setCreatedHighlightId(hlId);
    setShowHighlightModal(false);

    // Toast satisfaction notification
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      // Immediately open Glimpse conversion prompts!
      setShowConversionPrompt(true);
    }, 1500);
  };

  // 3. Convert to Journey handler
  const handleConfirmConvert = () => {
    setShowConversionPrompt(false);
    setShowJourneySettings(true);
  };

  const handleSkipConvert = () => {
    setShowConversionPrompt(false);
    setIsPaused(false);
    // Can continue watching or close, let's close as highlights workflow are finished!
    onClose();
  };

  const handleFinishJourneyConversion = () => {
    const journeyId = `hl-converted-${Date.now()}`;
    
    // Create actual journey posts from our story series
    const posts = slides.map((slide, index) => {
      let relativeDays = 5;
      if (index === 1) relativeDays = 3;
      if (index === 2) relativeDays = 1;

      return {
        id: `post-${journeyId}-${index}`,
        type: "photo" as const,
        url: slide.image,
        caption: slide.caption,
        daysAgo: relativeDays,
        likes: Math.floor(Math.random() * 40) + 12,
      };
    });

    createJourney({
      id: journeyId,
      title: journeyTitle,
      description: journeyDesc,
      theme: initialJourneyTheme,
      stage: journeyStage,
      followers: 1,
      startDate: "Jun 18, 2026",
      timeline: "ongoing",
      cover: slides[slides.length - 1]?.image || "",
      owner: CURRENT_USER.username,
      ownerAvatar: CURRENT_USER.avatar,
      posts: posts,
    });

    // Remove the highlight if we are converting it
    const targetHighlightId = highlightId || createdHighlightId;
    if (targetHighlightId) {
      deleteHighlight(targetHighlightId);
    }

    // Success overlay & redirection
    setShowJourneySettings(false);
    setShowSuccessSplash(true);

    setTimeout(() => {
      onClose();
      onNavigateToJourney(journeyId);
    }, 2800);
  };

  return (
    <div id="story-viewer-root" className="absolute inset-0 z-50 flex flex-col bg-neutral-950 select-none overflow-hidden">
      
      {/* 1. Header Progress Bars */}
      <div className="absolute top-0 inset-x-0 p-3 pb-8 bg-gradient-to-b from-black/80 to-transparent z-20 flex flex-col gap-3">
        <div className="flex gap-1.5 w-full">
          {slides.map((slide, idx) => {
            let widthPct = 0;
            if (idx < currentSlide) widthPct = 100;
            else if (idx === currentSlide) widthPct = progress;
            return (
              <div key={slide.id} className="h-1 flex-1 bg-neutral-700/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-75 ease-out rounded-full" 
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* 2. User Info header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src={CURRENT_USER.avatar} 
              alt={CURRENT_USER.displayName}
              className="h-9 w-9 rounded-full border border-white/30 object-cover" 
            />
            <div>
              <span className="text-white text-xs font-semibold block leading-tight">{CURRENT_USER.displayName}</span>
              <span className="text-neutral-300 text-[10px] block mt-0.5">{slides[currentSlide]?.time}</span>
            </div>
            <span className="bg-teal-500 text-[9px] uppercase px-1.5 py-0.5 rounded text-white font-bold tracking-wider scale-90">active</span>
          </div>

          <button 
            id="close-story-viewer-btn"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 active:scale-95 transition text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 3. Main Story Image Stage */}
      <div className="flex-1 relative flex items-center justify-center bg-neutral-900">
        <img 
          src={slides[currentSlide]?.image} 
          alt="" 
          className="w-full h-full object-cover"
        />

        {/* Invisible touch navigations overlay */}
        <div className="absolute inset-y-24 inset-x-0 flex z-10">
          <button 
            id="story-prev-tap"
            onClick={handlePrev} 
            className="w-[30%] h-full text-transparent outline-none cursor-pointer"
          />
          <button 
            id="story-pause-tap"
            onPointerDown={() => setIsPaused(true)}
            onPointerUp={() => setIsPaused(false)}
            onPointerLeave={() => setIsPaused(false)}
            className="w-[40%] h-full text-transparent outline-none cursor-default"
          />
          <button 
            id="story-next-tap"
            onClick={handleNext} 
            className="w-[30%] h-full text-transparent outline-none cursor-pointer"
          />
        </div>

        {/* Story Caption overlay bubble */}
        <div className="absolute inset-x-4 bottom-24 bg-black/65 backdrop-blur-md border border-white/10 p-3.5 rounded-xl text-white text-xs font-normal leading-relaxed text-center shadow-lg pointer-events-none z-10">
          {slides[currentSlide]?.caption}
        </div>
      </div>

      {/* 4. Instagram Footer Control Rail */}
      <div className="p-4 pb-6 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between gap-4 z-20">
        <div className="flex-1 bg-white/10 border border-white/20 rounded-full py-2.5 px-4 text-xs text-neutral-300">
          Send message…
        </div>

        {isHighlightMode ? (
          <button 
            id="convert-highlight-to-journey-footer-btn"
            onClick={() => {
              setIsPaused(true);
              setShowConversionPrompt(true);
            }}
            className="flex flex-col items-center justify-center text-white p-1 hover:text-teal-400 active:scale-90 transition outline-none cursor-pointer"
          >
            <div className="h-10 w-10 border border-teal-500/30 hover:border-teal-500 bg-teal-950/60 rounded-full flex items-center justify-center mb-0.5 text-teal-400">
              <Sparkles className="h-5 w-5 fill-none animate-pulse" />
            </div>
            <span className="text-[10px] font-bold tracking-wide uppercase text-teal-300">Convert</span>
          </button>
        ) : (
          <button 
            id="instagram-highlight-btn"
            onClick={handleHighlightClick}
            className="flex flex-col items-center justify-center text-white p-1 hover:text-rose-400 active:scale-90 transition outline-none cursor-pointer"
          >
            <div className="h-10 w-10 border border-white/20 hover:border-white/40 bg-zinc-900/60 rounded-full flex items-center justify-center mb-0.5">
              <Heart className="h-5 w-5 fill-none" />
            </div>
            <span className="text-[10px] font-bold tracking-wide uppercase text-neutral-300">Highlight</span>
          </button>
        )}
      </div>

      {/* MODAL 1: ADD TO HIGHLIGHTS OVERLAY */}
      <AnimatePresence>
        {showHighlightModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm z-30 flex items-end"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full bg-neutral-900 border-t border-neutral-800 rounded-t-2xl p-5 pb-8 select-text"
            >
              <div className="flex justify-between items-center mb-5">
                <span className="text-white text-sm font-semibold">Add to Highlights</span>
                <button 
                  onClick={() => { setShowHighlightModal(false); setIsPaused(false); }}
                  className="p-1 rounded-full bg-neutral-800 text-neutral-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {!isAddingNew ? (
                <div className="grid grid-cols-4 gap-4 py-2">
                  <button 
                    id="add-new-highlight-circle"
                    onClick={() => setIsAddingNew(true)}
                    className="flex flex-col items-center gap-1.5 focus:outline-none"
                  >
                    <div className="h-14 w-14 rounded-full border-2 border-dashed border-neutral-600 bg-neutral-800 flex items-center justify-center text-neutral-400">
                      <span className="text-xl font-light">+</span>
                    </div>
                    <span className="text-neutral-400 text-[11px] font-medium leading-none">New</span>
                  </button>
                  <div className="flex flex-col items-center gap-1.5 opacity-40">
                    <img src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=150&h=150&q=80" className="h-14 w-14 rounded-full object-cover" alt="" />
                    <span className="text-neutral-400 text-[11px] font-medium">Sunday Runs</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="p-highlight-name" className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">Highlight Name</label>
                    <input 
                      id="p-highlight-name"
                      type="text" 
                      value={newHighlightName}
                      onChange={(e) => setNewHighlightName(e.target.value)}
                      placeholder="e.g. Vintage Bike"
                      className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2.5 pt-1">
                    <button 
                      onClick={() => setIsAddingNew(false)}
                      className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold py-2 rounded-lg"
                    >
                      Back
                    </button>
                    <button 
                      id="save-new-highlight-btn"
                      onClick={handleCreateHighlight}
                      disabled={!newHighlightName.trim()}
                      className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white text-xs font-semibold py-2 rounded-lg transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST SUCCESS INDICATION */}
      <AnimatePresence>
        {successToast && (
          <div className="absolute inset-x-4 top-16 z-40 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-neutral-900 border border-emerald-500/30 text-white text-xs py-2.5 px-4 rounded-full flex items-center gap-2 shadow-2xl"
            >
              <div className="h-4 w-4 bg-emerald-500 rounded-full flex items-center justify-center text-neutral-950 font-bold text-[10px]">✓</div>
              <span>Added to Highlight <b>{newHighlightName}</b>!</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: GLIMPSE DETECTOR ASSISTANT OVERLAY */}
      <AnimatePresence>
        {showConversionPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-neutral-900 border border-teal-500/40 rounded-2xl p-5 w-full max-w-sm flex flex-col text-center relative overflow-hidden shadow-2xl"
            >
              {/* Pulsing ambient circle inside */}
              <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-teal-500/10 blur-xl pointer-events-none" />
              
              <div className="h-12 w-12 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Sparkles className="h-6 w-6" />
              </div>

              <h2 className="text-white font-extrabold text-base tracking-tight">Convert Highlight to Journey?</h2>
              <p className="text-neutral-400 text-xs mt-2.5 leading-relaxed">
                Smart Detection: Your <b>"{newHighlightName}"</b> highlight looks like a multi-step progressive project.
              </p>
              
              <p className="text-neutral-300 text-[11px] mt-2 bg-neutral-950/80 p-2.5 rounded-lg border border-neutral-800/60 leading-normal text-left">
                On Glimpse, converting this imports these stories as initial milestones of a <b>Journey</b>! Followers can subscribe to receive build logs and cheer your progress. This is the art of documenting!
              </p>

              <div className="mt-5 space-y-2.5">
                <button 
                  id="convert-story-to-journey-btn"
                  onClick={handleConfirmConvert}
                  className="w-full bg-teal-500 hover:bg-teal-600 hover:shadow-lg active:scale-98 text-white text-xs font-bold py-2.5 rounded-xl transition"
                >
                  Yes, convert to Journey! 🚀
                </button>
                <button 
                  onClick={handleSkipConvert}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 active:scale-98 text-neutral-400 text-xs font-semibold py-2 rounded-xl transition"
                >
                  Keep as Highlight only
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 3: JOURNEY SETTINGS SETUP FORM */}
      <AnimatePresence>
        {showJourneySettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md z-30 flex items-center justify-center p-4 select-text"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 w-full max-w-sm flex flex-col max-h-[92vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mb-4">
                <BookOpen className="h-5 w-5 text-teal-400 shrink-0" />
                <div>
                  <h3 className="text-white text-sm font-bold">Important Initial Settings</h3>
                  <p className="text-[10px] text-neutral-500 leading-tight">Configure your new Glimpse Journey</p>
                </div>
              </div>

              <div className="space-y-3.5 flex-1">
                {/* Title */}
                <div>
                  <label htmlFor="p-j-title" className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 block mb-1">Journey Title</label>
                  <input 
                    id="p-j-title"
                    type="text" 
                    value={journeyTitle}
                    onChange={(e) => setJourneyTitle(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="Journey title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="p-j-desc" className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 block mb-1">Journey Description</label>
                  <textarea 
                    id="p-j-desc"
                    value={journeyDesc}
                    onChange={(e) => setJourneyDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none resize-none leading-relaxed"
                    placeholder="Description"
                  />
                </div>

                {/* Current Stage */}
                <div>
                  <label htmlFor="p-j-stage" className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 block mb-1">Current Stage / Status</label>
                  <input 
                    id="p-j-stage"
                    type="text" 
                    value={journeyStage}
                    onChange={(e) => setJourneyStage(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="e.g. Week 1 · Primer completed"
                  />
                </div>

                {/* Cover Preview Card */}
                <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 flex items-center gap-3">
                  <img 
                    src={STORY_SLIDES[2].image} 
                    alt="cover preview" 
                    className="h-12 w-12 rounded object-cover border border-white/10"
                  />
                  <div>
                    <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-bold uppercase leading-none">Importing Cover & Milestones</span>
                    <span className="text-white text-xs block font-medium mt-1">3 active posts automatically imported</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 mt-5">
                <button 
                  onClick={() => { setShowJourneySettings(false); setIsPaused(false); }}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs font-semibold py-2 rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  id="convert-story-finish-btn"
                  onClick={handleFinishJourneyConversion}
                  disabled={!journeyTitle.trim()}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-neutral-950 hover:shadow-lg hover:brightness-110 text-xs font-bold py-2 rounded-xl transition"
                >
                  Convert & Create 🎉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFETTI SUCCESS SPLASH */}
      <AnimatePresence>
        {showSuccessSplash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900 z-50 flex flex-col items-center justify-center p-6 text-center select-text"
          >
            <motion.div 
              initial={{ scale: 0.6, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="space-y-4"
            >
              <div className="h-16 w-16 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full flex items-center justify-center text-neutral-950 font-bold mx-auto shadow-2xl relative">
                <Check className="h-7 w-7" />
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-x-0 inset-y-0 bg-teal-400 rounded-full scale-125 z-[-1]"
                />
              </div>

              <div>
                <h1 className="text-white font-extrabold text-xl tracking-tight">Highlight is now a Journey!</h1>
                <p className="text-neutral-400 text-xs mt-1 max-w-[260px] mx-auto">
                  Your story has successfully been converted. Followers can now subscribe and track your bicycle rebuild!
                </p>
              </div>

              <div className="text-[11px] text-teal-400/90 font-mono tracking-widest uppercase animate-pulse pt-2">
                Redirection to Journey details...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
