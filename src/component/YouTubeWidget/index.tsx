import clsx from "clsx";
import {
  Component,
  JSX,
  createEffect,
  createSignal,
} from "solid-js";
import { ulid } from "ulid";

import styles from "./index.module.styl";
import useYouTubeIFramePlayerApi, { YouTubeIFramePlayer } from "./useYouTubeIFramePlayerApi";

type SourceInfo = {
  videoId: string
} | {
  url: string
}
type Props = JSX.IntrinsicElements["iframe"]
  & SourceInfo
  & {
    usePlayer?: (player: YouTubeIFramePlayer) => void
    isActive: boolean
  }
const This: Component<Props> = (props) => {
  const [player, setPlayer] = createSignal<YouTubeIFramePlayer>();
  const [getRef, setRef] = createSignal<HTMLIFrameElement>();
  const id = ulid();
  const params
    = () => new URLSearchParams({
      enablejsapi: "1",
      origin: document.location.origin,
      rel: "0",
    });
  const videoId = () => {
    if ("videoId" in props) {
      return props.videoId;
    }
    try {
      const params = new URL(props.url).searchParams;
      const videoId = params.get("v");
      if (!videoId) return "";
      return videoId;
    } catch {
      return "";
    }
  };
  const src = () => `http://www.youtube.com/embed/${videoId()}?${params().toString()}`;

  createEffect(() => {
    const ref = getRef();
    if (!ref) return;
    const YT = useYouTubeIFramePlayerApi();
    if (!YT) return;
    YT.Player(id, {
      events: {
        onReady: (event) => {
          const player = event.target;
          const usePlayer = props.usePlayer;
          if (!usePlayer) return;
          player.setSize(ref.clientWidth, ref.clientHeight);
          usePlayer(player);
          setPlayer(player);
        },
      },
    });
  });

  const inactive = () => props.isActive ? "" : styles.Inactive;
  createEffect(() => inactive() ? player()?.pauseVideo() : "" );

  return (
    <iframe
      {...props}
      class={clsx(styles.YouTubeWidget, inactive(), props.class)}
      id={id}
      src={src()}
      ref={setRef}
      allow="autoplay"
    />
  );
};

export default This;
