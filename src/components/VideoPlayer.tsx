import Hls from "hls.js";
import { Loader2, Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Slider } from "@/components/ui/slider";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  title?: string;
  live?: boolean;
  watchOnly?: boolean;
};

function getYouTubeEmbedUrl(source: string, watchOnly: boolean) {
  try {
    const url = new URL(source);
    const videoId = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v");
    if (!videoId) return null;

    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      playsinline: "1",
      rel: "0",
      modestbranding: "1",
      controls: watchOnly ? "0" : "1",
      disablekb: watchOnly ? "1" : "0",
      fs: watchOnly ? "0" : "1",
      iv_load_policy: "3",
    });
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
  } catch {
    return null;
  }
}

export function VideoPlayer({
  src,
  poster,
  title,
  live = true,
  watchOnly = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const youTubeEmbedUrl = getYouTubeEmbedUrl(src, watchOnly);

  useEffect(() => {
    if (youTubeEmbedUrl) return;
    const video = videoRef.current;
    if (!video) return;
    let hls: Hls | undefined;
    setLoading(true);
    setError(false);

    const isHls = src.includes(".m3u8");
    if (!isHls) video.src = src;
    else if (video.canPlayType("application/vnd.apple.mpegurl")) video.src = src;
    else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setError(true);
      });
    } else setError(true);

    const onReady = () => {
      setLoading(false);
      video.play().catch(() => undefined);
    };
    video.addEventListener("loadeddata", onReady);
    return () => {
      video.removeEventListener("loadeddata", onReady);
      hls?.destroy();
    };
  }, [src, youTubeEmbedUrl]);

  // Keep the <video> element's volume level in sync with the slider —
  // setting `muted` on the prop alone doesn't drive intermediate volume.
  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume;
  }, [volume]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  };
  const toggleMuted = () => {
    setMuted((value) => {
      const next = !value;
      if (!next && volume === 0) setVolume(1);
      return next;
    });
  };
  const fullscreen = () => containerRef.current?.requestFullscreen?.().catch(() => undefined);

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-soft"
    >
      {youTubeEmbedUrl ? (
        <iframe
          className="h-full w-full border-0"
          src={youTubeEmbedUrl}
          title={title ?? "Video YouTube"}
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen={!watchOnly}
          tabIndex={watchOnly ? -1 : undefined}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            poster={poster}
            muted={muted}
            autoPlay
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onWaiting={() => setLoading(true)}
            onPlaying={() => setLoading(false)}
            className="h-full w-full object-cover"
          />
          {loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="h-9 w-9 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-6 text-center text-sm text-muted-foreground">
              Flux video momentanement indisponible.
            </div>
          )}
          {muted && !loading && !error && (
            <button
              type="button"
              onClick={toggleMuted}
              className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-black/85"
            >
              <VolumeX className="h-3.5 w-3.5" /> Activer le son
            </button>
          )}
          {/* Controls stay visible at all times (not hover-only) so they're
              reachable on touch devices, where :hover never fires. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4">
            <button
              type="button"
              onClick={toggle}
              aria-label={isPlaying ? "Pause" : "Lecture"}
              className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={toggleMuted}
              aria-label={muted ? "Activer le son" : "Couper le son"}
              className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            {!live && (
              <Slider
                value={[muted ? 0 : volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => {
                  const level = value / 100;
                  setVolume(level);
                  setMuted(level === 0);
                }}
                className="pointer-events-auto w-20 sm:w-28"
                aria-label="Volume"
              />
            )}
            {title && <span className="truncate text-sm font-medium text-white">{title}</span>}
            {!watchOnly && (
              <button
                type="button"
                onClick={fullscreen}
                aria-label="Plein ecran"
                className="pointer-events-auto ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
              >
                <Maximize className="h-4 w-4" />
              </button>
            )}
          </div>
        </>
      )}
      {youTubeEmbedUrl && watchOnly && <div className="absolute inset-0" aria-hidden="true" />}
      {live && (
        <span className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-live px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
          <span className="animate-live h-1.5 w-1.5 rounded-full bg-white" />
          Live
        </span>
      )}
    </div>
  );
}
