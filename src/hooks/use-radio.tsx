import { Howl } from "howler";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type RadioTrack = {
  id: string;
  name: string;
  url: string;
  cover: string;
};

type RadioContextValue = {
  current: RadioTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  play: (track: RadioTrack) => void;
  toggle: () => void;
  stop: () => void;
  setVolume: (v: number) => void;
};

const RadioContext = createContext<RadioContextValue | null>(null);

export function RadioProvider({ children }: { children: ReactNode }) {
  const howlRef = useRef<Howl | null>(null);
  const [current, setCurrent] = useState<RadioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.8);

  useEffect(
    () => () => {
      howlRef.current?.unload();
    },
    [],
  );

  const play = useCallback(
    (track: RadioTrack) => {
      if (current?.id === track.id && howlRef.current) {
        howlRef.current.play();
        return;
      }
      howlRef.current?.unload();
      setIsLoading(true);
      const howl = new Howl({
        src: [track.url],
        html5: true,
        format: ["aac", "mp3"],
        volume,
      });
      howl.on("play", () => {
        setIsPlaying(true);
        setIsLoading(false);
      });
      howl.on("pause", () => setIsPlaying(false));
      howl.on("stop", () => setIsPlaying(false));
      howl.on("loaderror", () => {
        setIsLoading(false);
        setIsPlaying(false);
      });
      howl.on("playerror", () => {
        setIsLoading(false);
        setIsPlaying(false);
      });
      howlRef.current = howl;
      setCurrent(track);
      howl.play();
    },
    [current, volume],
  );

  const toggle = useCallback(() => {
    const howl = howlRef.current;
    if (!howl) return;
    if (howl.playing()) howl.pause();
    else howl.play();
  }, []);

  const stop = useCallback(() => {
    howlRef.current?.stop();
    howlRef.current?.unload();
    howlRef.current = null;
    setCurrent(null);
    setIsPlaying(false);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    howlRef.current?.volume(v);
  }, []);

  return (
    <RadioContext.Provider
      value={{ current, isPlaying, isLoading, volume, play, toggle, stop, setVolume }}
    >
      {children}
    </RadioContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRadio() {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio must be used inside RadioProvider");
  return ctx;
}
