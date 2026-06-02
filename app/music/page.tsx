"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext"; 
import { TRACKS } from "@/lib/tracks";
import SectionHeader from "@/components/SectionHeader";
import VinylPlayer from "@/components/VinylPlayer";

// Modular Component Connections
import FilterSystem from "@/components/music/FilterSystem";
import TrackList from "@/components/music/TrackList";
import DownloadModal from "@/components/music/DownloadModal";
import ThankYouModal from "@/components/music/ThankYouModal"; 
import WaveformVisualizer from "@/components/music/WaveformVisualizer";
import VinylShelf from "@/components/music/VinylShelf";

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
  const [downloadTrack, setDownloadTrack] = useState<typeof TRACKS[0] | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [supportAmount, setSupportAmount] = useState("7.00");
  const [isEPDownload, setIsEPDownload] = useState(false);
  const [isLifetimePass, setIsLifetimePass] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

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
    const bpm = parseFloat(currentTrack?.bpm) || 120;
    return (60 / bpm) / 4;
  }, [currentTrack?.bpm]);

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

  useEffect(() => {
    let loadedCount = 0;
    TRACKS.forEach((track) => {
      const audio = new Audio(track.src);
      const checkComplete = () => {
        loadedCount++;
        if (loadedCount >= TRACKS.length) setIsInitialLoading(false);
      };

      audio.addEventListener("loadedmetadata", () => {
        setDurations((prev) => ({ ...prev, [track.id]: formatTime(audio.duration) }));
        checkComplete();
      });

      audio.addEventListener("error", checkComplete);
    });

    const handleResize = () => {
      setPlayerSize(window.innerWidth < 480 ? 240 : window.innerWidth < 768 ? 280 : 300);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSupport = async (method: 'stripe' | 'mercadopago') => {
    if (!downloadTrack && !isEPDownload && !isLifetimePass) return;
    setIsProcessing(true);
    
    try {
      const trackId = isLifetimePass ? "lifetime" : isEPDownload ? "full_ep" : downloadTrack?.id;
      const title = isLifetimePass ? "Lifetime Discography" : isEPDownload ? "Full EP Collection" : downloadTrack?.title;

      const response = await fetch(`/api/checkout/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(supportAmount), trackId, title }),
      });

      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Checkout failed");
    } catch (error) {
      console.error("Checkout error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto relative z-10">
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
        {/* Header Title Text Shadow Isolation */}
        <div className="relative z-20 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
          <SectionHeader label="MUSIC" sub="DISCOGRAPHY · RELEASES" />
        </div>

        <FilterSystem 
          activeType={activeType}
          activeGenre={activeGenre}
          genres={genres}
          updateURLParams={updateURLParams}
          onOpenLifetimePass={() => { setIsLifetimePass(true); setSupportAmount("25.00"); }}
          onOpenEPDownload={() => setIsEPDownload(true)}
        />

        {/* Core Layout Split Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start mt-12 relative z-10">
          
          {/* LEFT INTERACTIVE MODULE COLUMN */}
          <div 
            className="flex flex-col items-center gap-6 w-full p-6 sm:p-8 bg-[#090909]/60 border border-white/5 rounded-sm"
            style={{ backdropFilter: "blur(8px)" }}
          >
            {/* Component 1: The Spinning 3D Disc Engine */}
            <div className="relative py-2 w-full flex justify-center">
              <VinylPlayer size={playerSize} />
            </div>

            {/* Component 2: The Sliding Rack Release Changer */}
            <VinylShelf size={playerSize} />
            
            {/* Component 3: Dynamic Typography Readout Panel */}
            <AnimatePresence mode="wait">
              <motion.div key={currentTrack?.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center w-full">
                <h1 
                  style={{ 
                    fontFamily: "var(--font-barlow-condensed), sans-serif", 
                    fontWeight: 900, 
                    fontSize: "1.75rem", 
                    letterSpacing: "0.12em", 
                    color: currentTrack?.color || '#a8ff00',
                    textShadow: "0 2px 12px rgba(0,0,0,1), 0 4px 24px rgba(0,0,0,0.8)"
                  }}
                  className="uppercase transition-colors duration-300"
                >
                  {currentTrack?.title}
                </h1>
                <p 
                  style={{ 
                    fontFamily: "var(--font-barlow), sans-serif", 
                    fontWeight: 400, 
                    fontSize: "0.85rem", 
                    color: "#9e9e9e", // Shifted to high contrast silver-gray
                    marginTop: 6,
                    lineHeight: 1.5,
                    textShadow: "0 2px 8px rgba(0,0,0,1)"
                  }}
                  className="max-w-md mx-auto"
                >
                  {currentTrack?.desc}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* Component 4: Decoupled Multi-Bar Scrubbing Controller */}
            <div className="w-full mt-2">
              <WaveformVisualizer 
                progress={progress}
                isPlaying={isPlaying}
                onSeek={setProgress}
                color={currentTrack?.color || '#a8ff00'}
                playerSize={playerSize}
              />
            </div>
          </div>

          {/* RIGHT SELECTION TRACKLIST COLUMN */}
          <div 
            className="p-6 sm:p-8 bg-[#090909]/60 border border-white/5 rounded-sm w-full"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <TrackList 
              tracks={filteredTracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              durations={durations}
              activeGenre={activeGenre}
              onTrackSelect={(t) => currentTrack?.id === t.id ? toggle() : play(t)}
              onDownloadInit={(t) => setDownloadTrack(t)}
            />
          </div>

        </div>
      </motion.div>

      {/* Modal Systems */}
      <AnimatePresence>
        {(downloadTrack || isEPDownload || isLifetimePass) && (
          <DownloadModal 
            downloadTrack={downloadTrack}
            isEPDownload={isEPDownload}
            isLifetimePass={isLifetimePass}
            supportAmount={supportAmount}
            isProcessing={isProcessing}
            setSupportAmount={setSupportAmount}
            onSupport={handleSupport}
            onFreeDownload={() => {
              if (isLifetimePass) router.push(`/checkout/successful?track=lifetime&type=digital&amount=0`);
              else if (isEPDownload) router.push(`/checkout/successful?track=full_ep&type=digital&amount=0`);
              else if (downloadTrack) {
                const link = document.createElement('a');
                link.href = downloadTrack.src;
                link.download = `${downloadTrack.title}.mp3`;
                link.click();
                setDownloadTrack(null);
                setShowThankYou(true);
              }
            }}
            onClose={() => { setDownloadTrack(null); setIsEPDownload(false); setIsLifetimePass(false); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showThankYou && (
          <ThankYouModal 
            showThankYou={showThankYou}
            isPlaying={isPlaying}
            grainDuration={grainDuration}
            onClose={() => setShowThankYou(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}