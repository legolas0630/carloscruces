"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/lib/PlayerContext";
import { TRACKS } from "@/lib/tracks";
import VinylPlayer from "@/components/VinylPlayer";
import SectionHeader from "@/components/SectionHeader";

export default function MusicPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <MusicContent />
    </Suspense>
  );
}

function MusicContent() {
  const { currentTrack, isPlaying, progress, play, toggle, setProgress } = usePlayer();
  const [playerSize, setPlayerSize] = useState(300);
  const [activeType, setActiveType] = useState<'ALL' | 'EP' | 'Single'>('ALL');
  const [activeGenre, setActiveGenre] = useState('ALL');
  const [durations, setDurations] = useState<Record<number, string>>({});
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [downloadTrack, setDownloadTrack] = useState<typeof TRACKS[0] | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [supportAmount, setSupportAmount] = useState("7.00");
  const [isEPDownload, setIsEPDownload] = useState(false);
  const [isLifetimePass, setIsLifetimePass] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const waveformRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Sync URL params with local state (Optimized for multiple simultaneous filters)
  useEffect(() => {
    const type = searchParams.get('type');
    const genre = searchParams.get('genre');
    const downloadId = searchParams.get('download');

    if (type) setActiveType(type as any);
    else setActiveType('ALL');

    if (genre) setActiveGenre(genre);
    else setActiveGenre('ALL');

    if (downloadId) {
      const track = TRACKS.find(t => t.id === parseInt(downloadId));
      if (track) setDownloadTrack(track);
    }
  }, [searchParams]);

  const updateURLParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'ALL') params.delete(key);
    else params.set(key, value);
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const grainDuration = React.useMemo(() => {
    const bpm = parseFloat(currentTrack.bpm) || 120;
    return (60 / bpm) / 4; // Sync to 1/4 beat for rhythmic high-frequency fuzz
  }, [currentTrack.bpm]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const genres = ['ALL', ...Array.from(new Set(TRACKS.map(t => t.genre)))];
  const filteredTracks = TRACKS.filter(t => 
    (activeType === 'ALL' || t.type === activeType) && 
    (activeGenre === 'ALL' || t.genre === activeGenre)
  );

  const handleSeek = useCallback((clientX: number) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);
  }, [setProgress]);

  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => setShowThankYou(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showThankYou]);

  useEffect(() => {
    if (!isScrubbing) return;

    const onMouseMove = (e: MouseEvent) => handleSeek(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleSeek(e.touches[0].clientX);
    const onStopScrubbing = () => setIsScrubbing(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onStopScrubbing);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onStopScrubbing);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onStopScrubbing);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onStopScrubbing);
    };
  }, [isScrubbing, handleSeek]);

  useEffect(() => {
    let loadedCount = 0;
    TRACKS.forEach((track) => {
      const audio = new Audio(track.src);
      const checkComplete = () => {
        loadedCount++;
        if (loadedCount >= TRACKS.length) setIsInitialLoading(false);
      };

      audio.addEventListener("loadedmetadata", () => {
        setDurations((prev) => ({
          ...prev,
          [track.id]: formatTime(audio.duration),
        }));
        checkComplete();
      });

      audio.addEventListener("error", checkComplete);
    });

    const handleResize = () => {
      // Use 240px for mobile, 280px for tablets, and 300px for desktop
      setPlayerSize(window.innerWidth < 480 ? 240 : window.innerWidth < 768 ? 280 : 300);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSupport = async () => {
    if (!downloadTrack && !isEPDownload && !isLifetimePass) return;
    setIsProcessing(true);
    
    // Simulate payment processing delay (e.g. Stripe checkout session creation)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    const trackId = isLifetimePass ? "lifetime" : isEPDownload ? "full_ep" : downloadTrack?.id;
    setDownloadTrack(null);
    setIsLifetimePass(false);
    setIsEPDownload(false);
    router.push(`/checkout/successful?track=${trackId}&type=digital&amount=${supportAmount}`);
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto">
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div 
            initial={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] bg-black flex flex-col items-center justify-center gap-4"
          >
            <div className="w-12 h-12 border-2 border-[#a8ff00]/10 border-t-[#a8ff00] rounded-full animate-spin" />
            <div className="text-[0.6rem] tracking-[0.4em] text-[#a8ff00] uppercase font-bold animate-pulse">Initialising Frequencies</div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <SectionHeader label="MUSIC" sub="DISCOGRAPHY · RELEASES" />

        {/* Filter System */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-b border-[#1a1a1a] pb-6">
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168,255,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsLifetimePass(true); setSupportAmount("25.00"); }}
              className="px-4 py-1.5 bg-[#a8ff00] text-black text-[0.7rem] font-black tracking-[0.2em] rounded-sm mr-4 flex items-center gap-2"
            >
              <span className="text-xs">∞</span> LIFETIME PASS
            </motion.button>
            <div className="flex gap-4">
              {['ALL', 'EP', 'Single'].map((type) => (
                <button
                  key={type}
                  onClick={() => updateURLParams('type', type)}
                  className={`text-[0.65rem] font-bold tracking-[0.2em] transition-all ${activeType === type ? 'text-[#a8ff00]' : 'text-[#444] hover:text-[#888]'}`}
                >
                  {type === 'Single' ? 'SINGLES' : type === 'EP' ? 'EPS' : 'ALL RELEASES'}
                </button>
              ))}
            </div>
            {activeType === 'EP' && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setIsEPDownload(true)}
                className="px-3 py-1 bg-[#a8ff00] text-black text-[0.6rem] font-black tracking-widest rounded-sm ml-2"
              >
                DOWNLOAD FULL EP
              </motion.button>
            )}
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => updateURLParams('genre', g)}
                className={`px-3 py-1 rounded-full border text-[0.6rem] whitespace-nowrap transition-all ${
                  activeGenre === g 
                    ? 'border-[#a8ff00] text-[#a8ff00] bg-[#a8ff00]/5' 
                    : 'border-[#222] text-[#555] hover:border-[#444]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center mt-12">
          <div className="flex flex-col items-center gap-10">
            <div className="relative py-10 w-full flex justify-center">
              <VinylPlayer size={playerSize} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={currentTrack.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 900, fontSize: "1.6rem", letterSpacing: "0.15em", color: currentTrack.color }}>
                  {currentTrack.title}
                </div>
                <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.8rem", color: "#555", marginTop: 4 }}>
                  {currentTrack.desc}
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Waveform visualizer */}
            <div 
              ref={waveformRef}
              onMouseDown={(e) => { setIsScrubbing(true); handleSeek(e.clientX); }}
              onTouchStart={(e) => { setIsScrubbing(true); handleSeek(e.touches[0].clientX); }}
              style={{ 
                width: "100%", height: 48, display: "flex", alignItems: "center", gap: 2, 
                cursor: "pointer", touchAction: "none" 
              }}
            >
              {Array.from({ length: playerSize < 250 ? 40 : 80 }).map((_, i) => {
                const totalBars = playerSize < 250 ? 40 : 80;
                const filled = (i / totalBars) * 100 < progress;
                const isMobile = playerSize < 250;

                return (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: (isPlaying || isScrubbing) 
                        ? (isMobile ? ["20px", "35px", "20px"] : [`${15 + Math.random() * 10}px`, `${30 + Math.random() * 15}px`, `${15 + Math.random() * 10}px`])
                        : `${8 + Math.sin(i * 0.5) * 10}px`,
                      opacity: isScrubbing ? [0.7, 1, 0.7] : 1,
                      background: filled ? currentTrack.color : "#1a1a1a",
                      boxShadow: filled 
                        ? (isScrubbing 
                            ? `0 0 15px ${currentTrack.color}, 0 0 30px ${currentTrack.color}66` 
                            : `0 0 4px ${currentTrack.color}`) 
                        : "none"
                    }}
                    transition={{ 
                      height: { duration: isMobile ? 0.4 : 0.15, repeat: (isPlaying || isScrubbing) ? Infinity : 0, repeatType: "mirror", delay: i * 0.01 },
                      opacity: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
                      background: { duration: isScrubbing ? 0 : 0.2, ease: "linear" },
                      boxShadow: { duration: isScrubbing ? 0 : 0.2, ease: "linear" }
                    }}
                    style={{ 
                      flex: 1, 
                      borderRadius: 1, 
                      minHeight: 2, 
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 400, fontSize: "0.7rem", letterSpacing: "0.3em", color: "#444", marginBottom: "0.5rem" }}>
              {activeGenre !== 'ALL' ? `${activeGenre} TRACKS` : 'TRACKLIST'} ({filteredTracks.length})
            </div>
            {filteredTracks.map((t, i) => {
              const active = currentTrack.id === t.id;
              return (
                <motion.div
                  key={t.id}
                  whileHover={{ 
                    x: 4,
                    boxShadow: `0 0 20px ${t.color}33`,
                    borderColor: `${t.color}66`
                  }}
                  onClick={() => active ? toggle() : play(t)}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "1rem 1.2rem", cursor: "pointer",
                    background: active ? "#111" : "transparent",
                    border: `1px solid ${active ? t.color + "44" : "#1a1a1a"}`,
                    borderRadius: 2, transition: "all 0.2s",
                    boxShadow: active ? `0 0 15px ${t.color}22` : "none"
                  }}
                >
                  <div style={{ width: 32, textAlign: "center" }}>
                    {active && isPlaying ? (
                      <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                        <span style={{ color: t.color, fontSize: "1rem" }}>▶</span>
                      </motion.div>
                    ) : (
                      <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", color: "#333", fontSize: "0.8rem" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <img src={t.img} alt={t.title} style={{ width: 40, height: 40, borderRadius: 2, objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.1em", color: active ? t.color : "#f0f0f0" }}>
                      {t.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[0.6rem] px-1.5 py-0.5 rounded-sm bg-[#1a1a1a] text-[#888] font-bold">{t.type}</span>
                      <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.7rem", color: "#555" }}>
                        {t.genre} · {t.bpm}
                      </div>
                    </div>
                  </div>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ color: t.color, scale: 1.1 }}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setDownloadTrack(t); 
                    }}
                    className="text-[#333] transition-colors"
                    title="Download"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                  </motion.button>
                  <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "0.8rem", color: "#444", minWidth: "35px", textAlign: "right" }}>
                    {durations[t.id] || "..."}
                  </div>
                </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Vinyl Shelf */}
        <div className="mt-24">
          <div className="mb-6 flex items-center justify-between border-b border-[#1a1a1a] pb-4">
            <div className="font-black text-xs tracking-[0.4em] text-[#444]">VINYL SHELF</div>
            <div className="text-[0.6rem] text-[#222]">SELECT RELEASE TO SWAP</div>
          </div>
          <div 
            className="relative px-6 py-12 rounded-sm overflow-hidden"
            style={{
              backgroundColor: "#0d0d0d",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='wood' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01 0.4' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23wood)' opacity='0.12'/%3E%3C/svg%3E")`,
              boxShadow: "inset 0 0 60px rgba(0,0,0,1), 0 1px 0 rgba(255,255,255,0.03)"
            }}
          >
            <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar relative z-10">
            {filteredTracks.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -10, rotateY: -10 }}
                onClick={() => play(t)}
                className="relative group shrink-0 cursor-pointer"
                style={{ perspective: 1000 }}
              >
                <div 
                  className={`w-32 h-32 sm:w-40 sm:h-40 transition-all duration-500 border ${currentTrack.id === t.id ? 'border-[#a8ff00] shadow-[0_0_30px_rgba(168,255,0,0.2)]' : 'border-white/5'}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img src={t.sleeveImg || t.img} alt={t.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="text-[0.6rem] font-bold text-[#a8ff00] leading-tight truncate">{t.title}</div>
                    <div className="text-[0.5rem] text-white/50">{t.bpm}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
            {/* Bottom shelf ledge */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a]"
              style={{ boxShadow: "0 -2px 12px rgba(0,0,0,0.9)" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Download / Pay Your Price Modal */}
      <AnimatePresence>
        {(downloadTrack || isEPDownload || isLifetimePass) && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setDownloadTrack(null); setIsEPDownload(false); setIsLifetimePass(false); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[400px] bg-[#0f0f0f] border border-white/10 p-8 rounded-sm shadow-2xl text-center"
            >
              <div className="text-[0.6rem] tracking-[0.4em] text-[#444] mb-2 uppercase font-bold">
                {isLifetimePass ? "ULTIMATE ACCESS" : isEPDownload ? "COLLECTION DOWNLOAD" : "DIGITAL DOWNLOAD"}
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-1" style={{ color: (isEPDownload || isLifetimePass) ? "#a8ff00" : downloadTrack?.color }}>
                {isLifetimePass ? "LIFETIME DISCOGRAPHY" : isEPDownload ? "FULL EP COLLECTION" : downloadTrack?.title}
              </h2>
              <p className="text-xs text-gray-500 mb-8 font-light tracking-widest">
                {isLifetimePass ? "INSTANT ACCESS TO ALL CURRENT & FUTURE RELEASES" : isEPDownload ? "ALL TRACKS INCLUDED" : `${downloadTrack?.genre} · ${downloadTrack?.bpm}`}
              </p>

              <div className="space-y-6">
                {/* Pay your price option */}
                <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                  <div className="text-[0.7rem] tracking-widest text-gray-400 mb-4 uppercase">Pay what you want</div>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-2xl font-bold text-white opacity-50">$</span>
                    <input 
                      type="number" 
                      value={supportAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || (parseFloat(val) >= 0 && !val.includes('-'))) {
                          setSupportAmount(val);
                        }
                      }}
                      placeholder="7.00"
                      min="0"
                      step="0.50"
                      className="bg-transparent border-b border-white/20 text-2xl font-bold text-white focus:outline-none focus:border-[#a8ff00] w-24 text-center"
                    />
                  </div>
                  <button 
                    disabled={isProcessing}
                    className={`w-full py-3 ${isProcessing ? 'bg-[#a8ff00]/50 cursor-wait' : 'bg-[#a8ff00]'} text-black font-black text-xs tracking-[0.2em] rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all`}
                    onClick={handleSupport}
                  >
                    {isProcessing ? 'PROCESSING...' : 'SUPPORT & DOWNLOAD'}
                  </button>
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <div className="relative flex justify-center text-[0.6rem] uppercase tracking-[0.3em]"><span className="bg-[#0f0f0f] px-4 text-[#333]">or</span></div>
                </div>

                {/* Free option */}
                <button 
                  onClick={() => {
                    if (isLifetimePass) {
                      router.push(`/checkout/successful?track=lifetime&type=digital&amount=0`);
                    } else if (isEPDownload) {
                      router.push(`/checkout/successful?track=full_ep&type=digital&amount=0`);
                    } else if (downloadTrack) {
                      const link = document.createElement('a');
                      link.href = downloadTrack.src;
                      link.download = `${downloadTrack.title}.mp3`;
                      link.click();
                      setDownloadTrack(null);
                      setShowThankYou(true);
                    }
                  }}
                  className="text-[0.7rem] tracking-[0.3em] text-gray-500 hover:text-white transition-colors uppercase font-bold"
                >
                  Download for free
                </button>
              </div>

              <button 
                onClick={() => { setDownloadTrack(null); setIsEPDownload(false); setIsLifetimePass(false); }}
                className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Thank You Modal */}
      <AnimatePresence>
        {showThankYou && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowThankYou(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[400px] text-center"
            >
              <motion.div 
                animate={{ 
                  textShadow: isPlaying 
                    ? [
                        "0 0 10px #a8ff00, 2px 0 #00ffcc, -2px 0 #ff4400", 
                        "0 0 20px #a8ff00, -1px 0 #cc00ff, 1px 0 #00ffcc", 
                        "0 0 10px #a8ff00"
                      ] 
                    : [
                        "0 0 15px rgba(168, 255, 0, 0.15), 0 2px 10px rgba(0,0,0,0.3)", 
                        "0 0 30px rgba(168, 255, 0, 0.45), 0 2px 10px rgba(0,0,0,0.3)", 
                        "0 0 15px rgba(168, 255, 0, 0.15), 0 2px 10px rgba(0,0,0,0.3)"
                      ] 
                }}
                transition={{ 
                  duration: isPlaying ? grainDuration : 2.5, 
                  repeat: Infinity, 
                  repeatType: isPlaying ? "reverse" : "mirror",
                  ease: isPlaying ? "linear" : "easeInOut"
                }}
                className="text-5xl font-black tracking-tighter text-[#a8ff00] mb-4"
              >
                THANK YOU
              </motion.div>
              <p className="text-sm text-gray-400 font-light tracking-[0.2em] uppercase mb-8">Your support keeps the frequencies alive.</p>
              <button 
                onClick={() => setShowThankYou(false)}
                className="px-8 py-3 border border-white/10 text-[0.6rem] tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all rounded-sm uppercase font-bold"
              >
                Return to soundscape
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
