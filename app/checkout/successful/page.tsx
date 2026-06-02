import React from "react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { TRACKS } from "@/lib/tracks";

export default async function CheckoutSuccessfulPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const isDigital = params.type === 'digital';
  const trackParam = typeof params.track === 'string' ? params.track : null;
  const isEP = trackParam === 'full_ep';
  const isLifetime = trackParam === 'lifetime';
  
  const track = !isEP && !isLifetime && trackParam ? TRACKS.find(t => t.id === parseInt(trackParam)) : null;
  const downloadTracks = isLifetime ? TRACKS : isEP ? TRACKS.filter(t => t.type === 'EP') : [];

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto">
      <div className="max-w-2xl">
        <SectionHeader 
          label={isDigital ? "DOWNLOAD READY" : "CHECKOUT SUCCESSFUL"} 
          sub={isDigital ? "FREQUENCIES UNLOCKED · THANK YOU" : "ORDER CONFIRMED · THANK YOU"} 
        />

        <div className="mt-12 bg-[#111] border border-[#1a1a1a] rounded-sm p-6 sm:p-8">
          <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
            Confirmation
          </div>
          <div className="mt-3 text-2xl sm:text-3xl tracking-[0.12em] text-[#a8ff00] uppercase font-black">
            {isDigital && (isEP || isLifetime || track) ? (isLifetime ? "LIFETIME PASS UNLOCKED" : isEP ? "EP COLLECTION UNLOCKED" : `UNLOCKED: ${track?.title}`) : "Your order is on the way."}
          </div>
          <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-[#999] font-normal">
            {isDigital && (isEP || isLifetime || track)
              ? "Thank you for supporting the underground. Your high-quality audio file is ready for download below. A confirmation and backup link has also been sent to your email."
              : "We have received your checkout details and started processing the order. You’ll get an email confirmation shortly."}
          </p>

          <div className="mt-6 grid gap-3 text-sm text-[#999]">
            <div className="flex items-center justify-between">
              <span>{isDigital ? "License" : "Order number"}</span>
              <span className="text-[#f0f0f0] font-mono">{isDigital ? `DIG-AUTH-${isEP ? 'COL' : trackParam || 'ERR'}-2026` : "CC-2026-0147"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="text-[#a8ff00]">Processing</span>
            </div>
          </div>

          {(isEP || isLifetime) && (
            <div className="mt-10 space-y-4 border-t border-white/5 pt-8">
              <div className="text-[0.6rem] tracking-[0.3em] uppercase text-gray-500 mb-4">{isLifetime ? "Full Discography" : "Collection Tracks"}</div>
              {downloadTracks.map(t => (
                <div key={t.id} className="flex items-center justify-between bg-white/5 p-4 rounded-sm border border-white/5">
                  <div>
                    <div className="text-sm font-bold text-white uppercase tracking-wider">{t.title}</div>
                    <div className="text-[0.6rem] text-gray-500 uppercase tracking-widest">{t.genre} · {t.bpm}</div>
                  </div>
                  <a 
                    href={t.src} 
                    download={`${t.title}.mp3`}
                    className="text-[0.6rem] font-black tracking-widest text-[#a8ff00] hover:text-white transition-colors"
                  >
                    DOWNLOAD
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {isDigital && track && !isEP && !isLifetime ? (
              <a
                href={track.src}
                download={`${track.title}.mp3`}
                className="inline-flex items-center justify-center rounded-sm border border-[#a8ff00] bg-[#a8ff00] px-8 py-4 text-[0.7rem] font-black tracking-[0.3em] text-[#0a0a0a] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                DOWNLOAD FILE
              </a>
            ) : (
              <Link
                href="/merch"
                className="inline-flex items-center justify-center rounded-sm border border-[#a8ff00] bg-[#a8ff00] px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#0a0a0a] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                CONTINUE SHOPPING
              </Link>
            )}
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-sm border border-[#222] bg-transparent px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#f0f0f0] transition-colors hover:border-[#a8ff00] hover:text-[#a8ff00]"
            >
              RETURN HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
