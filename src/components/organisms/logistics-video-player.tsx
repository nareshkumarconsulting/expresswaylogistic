"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

const POSTER_SRC = "/images/hero-port-1280.webp";
const POSTER_SRC_SET =
  "/images/hero-port-750.webp 750w, /images/hero-port-1280.webp 1280w";
const VIDEO_SRC = "/videos/expressway-logistic.mp4";

export function LogisticsVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [pending, setPending] = useState(false);

  function startPlayback() {
    const video = videoRef.current;
    if (!video || pending || started) return;

    if (!video.getAttribute("src")) {
      video.src = VIDEO_SRC;
    }

    setPending(true);
    void video.play().catch(() => {
      setPending(false);
    });
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full bg-black object-cover"
        preload="none"
        playsInline
        controls={started}
        onPlaying={() => {
          setStarted(true);
          setPending(false);
        }}
        aria-label="ExpressWay Logistic film: freight quotes and shipment tracking"
        aria-hidden={!started}
      />

      {started ? null : (
        <button
          type="button"
          onClick={startPlayback}
          disabled={pending}
          aria-busy={pending}
          className="group absolute inset-0 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset disabled:cursor-wait"
          aria-label="Play the ExpressWay Logistic film"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={POSTER_SRC}
            srcSet={POSTER_SRC_SET}
            sizes="100vw"
            alt=""
            width={1280}
            height={1280}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover sm:transition sm:duration-700 sm:group-hover:scale-[1.02]"
          />
          <span
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(4,21,38,0.72)_100%)]"
            aria-hidden
          />
          <span
            className="absolute inset-0 bg-gradient-to-t from-[#041526] via-[#041526]/15 to-[#041526]/55"
            aria-hidden
          />
          <span
            className="absolute inset-x-0 top-0 h-2 bg-black sm:h-3"
            aria-hidden
          />
          <span
            className="absolute inset-x-0 bottom-0 h-2 bg-black sm:h-3"
            aria-hidden
          />

          <span className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
            <span className="flex size-16 items-center justify-center rounded-full border border-white/75 bg-[#041526]/50 text-white shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-md transition duration-300 group-hover:scale-105 group-hover:border-accent group-hover:bg-[#041526]/70 sm:size-24">
              <Play className="size-7 translate-x-0.5 fill-current sm:size-9" aria-hidden />
            </span>
            <span className="text-[11px] font-semibold tracking-[0.28em] text-white uppercase">
              {pending ? "Loading" : "Play"}
            </span>
          </span>

          <span className="absolute right-4 bottom-3 left-4 z-10 hidden sm:right-8 sm:bottom-10 sm:left-8 sm:block md:left-12">
            <span className="mb-2 block text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
              ExpressWay Logistic
            </span>
            <span className="block max-w-xl text-2xl leading-tight font-semibold text-white sm:text-4xl">
              Freight quotes and shipment tracking
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
