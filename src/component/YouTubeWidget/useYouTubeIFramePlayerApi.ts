import { createRoot, createSignal } from "solid-js";

export type YouTubeIFramePlayer
  = Methods
  & Getters

type Methods = {
  playVideo: () => void
  pauseVideo: () => void
  mute: () => void
  unMute: () => void
  setVolume: (volume: Volume) => void
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void
  setSize: (width: number, height: number) => void
}
type Getters = {
  getVolume: Getter<Volume>
  getDuration: Getter<MilliSecond>
  getVideoUrl: () => string

  getPosition: Getter<MilliSecond>
  getSounds: Getter<Sound[]>
  getCurrentSound: Getter<Sound>
  isPaused: Getter<boolean>
}

/**
 * 0 ~ 100
 */
type Volume = number
type MilliSecond = number
type Sound = any
type Getter<T> = (callback?: any) => T

type YouTubeIFramePlayerApi = {
  Player: (id: string, options: CreateOptions) => YouTubeIFramePlayer
}
type CreateOptions = {
  events?: Events
  playerVars?: any
}
type Events = {
  onReady?: (event: EventArgs) => void
  onStateChange?: (event: EventArgs) => void
}
type EventArgs = {
  target: YouTubeIFramePlayer
}

const loadScript = () => {
  const [getYT, setYT] = createSignal<any>();
  (window as any).onYouTubeIframeAPIReady = () => {
    setYT((window as any).YT);
  };

  const element = document.createElement("script");
  element.type = "text/javascript";
  element.src = "https://www.youtube.com/player_api";
  document.head.prepend(element);


  // const [SC, setSC] = createSignal((window as any).SC, { equals: false });
  return (): YouTubeIFramePlayerApi | undefined => {
    const YT = getYT();
    if (!YT) return;
    return {
      Player: (id, options) => new YT.Player(id, options),
    };
  };
};

const useYouTubeIFramePlayerApi = createRoot(loadScript);

export default useYouTubeIFramePlayerApi;
