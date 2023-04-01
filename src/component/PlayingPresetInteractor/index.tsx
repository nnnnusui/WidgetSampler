import clsx from "clsx";
import {
  Component,
  JSX,
  Show,
  createSignal,
} from "solid-js";
import { SetStoreFunction } from "solid-js/store";

import styles from "./index.module.styl";
import PlayingPresetInputter from "../PlayingPresetInputter";

import PlayingPreset from "@/type/PlayingPreset";

type Props = JSX.IntrinsicElements["div"]
  & {
    preset: PlayingPreset
    setPreset: SetStoreFunction<PlayingPreset>
    removePreset: () => void
    play: (preset: PlayingPreset) => void
    onPreview: (orders: PlayingPreset["orders"]) => void
    activeSource: string
  }
const This: Component<Props> = (props) => {
  const [editMode, setEditMode] = createSignal(false);
  const name = () => props.preset.name;
  const opacity = () => props.preset.opacity;
  const cssBgColor = () => {
    const bgColor = () => props.preset.bgColor;
    const r = parseInt(bgColor().substring(1, 3), 16);
    const g = parseInt(bgColor().substring(3, 5), 16);
    const b = parseInt(bgColor().substring(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  const onClick: JSX.EventHandler<HTMLElement, MouseEvent>
    = () => {
      props.play(props.preset);
    };
  const onContextMenu: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
    = (event) => {
      event.preventDefault();
      setEditMode(true);
    };

  return (
    <div
      {...props}
      class={clsx(styles.PlayingPresetInteractor, props.class)}
      style={{
        "background-color": `rgba(${cssBgColor()}, ${opacity()})`,
      }}
    >
      <Show when={!editMode()}>
        <button
          class={styles.PlayingPresetPlayButton}
          onContextMenu={onContextMenu}
          onClick={onClick}
        >
          <h1>{name()}</h1>
        </button>
      </Show>
      <Show when={editMode()}>
        <PlayingPresetInputter
          preset={props.preset}
          setPreset={props.setPreset}
          removePreset={props.removePreset}
          onSubmit={() => setEditMode(false)}
          onPreview={props.onPreview}
        />
      </Show>
    </div>
  );
};

export default This;
