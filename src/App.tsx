import {
  MetaProvider,
} from "@solidjs/meta";
import {
  Component,
  createEffect,
  createSignal,
  For,
  ParentComponent,
  untrack,
} from "solid-js";
import { createStore } from "solid-js/store";
import { ulid } from "ulid";

import _Head from "./_Head";
import styles from "./App.module.styl";
import PlayingPresetExporter from "./component/PlayingPresetExporter";
import PlayingPresetImporter from "./component/PlayingPresetImporter";
import PlayingPresetInteractor from "./component/PlayingPresetInteractor";
import YouTubeWidget from "./component/YouTubeWidget";
import { YouTubeIFramePlayer } from "./component/YouTubeWidget/useYouTubeIFramePlayerApi";
import PlayingPreset from "./type/PlayingPreset";

const Providers: ParentComponent = (props) => (
  <MetaProvider>
    {props.children}
  </MetaProvider>
);

const App: Component = () => {
  const presetsFromLocalStorage = () => {
    const raw = window.localStorage.getItem("presets");
    if (!raw) return [];
    return JSON.parse(raw) as PlayingPreset[];
  };
  const [presets, setPresets] = createStore<PlayingPreset[]>(presetsFromLocalStorage());
  createEffect(() => {
    window.localStorage.setItem("presets", JSON.stringify(presets));
  });

  const [players, setPlayers] = createStore<{
    source: string
    player: YouTubeIFramePlayer
    isActive: boolean
  }[]>([]);
  const sources = () => [...new Set(presets.flatMap((it) => it.orders.map((it) => it.source)))];
  const firstSource = () => {
    const first = sources().find(() => true);
    return first ? first : "";
  };
  const [activeSource, setActiveSource] = createSignal(untrack(firstSource));

  const playOrders = (orders: PlayingPreset["orders"]) => {
    (async () => {
      for (const order of orders) {
        setActiveSource(order.source);
        const player = players.find((it) => it.source === order.source)?.player;
        player?.seekTo(order.time);
        player?.playVideo();
        await new Promise((resolve) => setTimeout(resolve, order.duration * 1000));
        player?.pauseVideo();
      }
    })();
  };
  const playPreset = (preset: PlayingPreset) => {
    playOrders(preset.orders);
  };
  const addPreset = () => {
    const empty: PlayingPreset
      = {
        id: ulid(),
        name: "----",
        bgColor: "#aaaaaa",
        opacity: 0.8,
        orders: [],
      };
    setPresets(presets.length, empty);
  };
  const removePreset = (id: string) => {
    setPresets((it) => it.filter((it) => it.id !== id));
  };

  return (
    <Providers>
      <_Head />
      <div
        class={styles.WidgetContainer}
      >
        <For each={sources()}>{(source, index) => {
          const setPlayer = (it: YouTubeIFramePlayer) =>
            setPlayers(index(), {
              source,
              player: it,
            });
          return (
            <YouTubeWidget
              url={source}
              usePlayer={setPlayer}
              isActive={activeSource() === source}
              class={styles.Widget}
            />
          );
        }
        }</For>
      </div>
      <div
        class={styles.Main}
      >
        <PlayingPresetImporter setPresets={setPresets} />
        <PlayingPresetExporter presets={presets} />
        <For each={presets}>{(preset) =>
          <PlayingPresetInteractor
            preset={preset}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setPreset={(...args: unknown[]) => setPresets((it) => it.id === preset.id, ...args)}
            removePreset={() => removePreset(preset.id)}
            play={playPreset}
            onPreview={playOrders}
            activeSource={activeSource()}
          />
        }</For>
        <button
          onClick={addPreset}
          class={styles.AddPresetButton}
        >+</button>
      </div>
    </Providers>
  );
};

export default App;
