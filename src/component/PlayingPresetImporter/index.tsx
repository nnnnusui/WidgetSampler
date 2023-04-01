import clsx from "clsx";
import {
  Component,
  JSX,
} from "solid-js";
import { SetStoreFunction, produce } from "solid-js/store";

import styles from "./index.module.styl";

import PlayingPreset from "@/type/PlayingPreset";

type Props = JSX.IntrinsicElements["label"]
  & {
    setPresets: SetStoreFunction<PlayingPreset[]>
  }
const This: Component<Props> = (props) => {
  const reader = new FileReader();
  reader.onload = () => {
    const loadedPresets = JSON.parse(reader.result as string) as PlayingPreset[];
    props.setPresets(
      produce((presets) => {
        for (const preset of loadedPresets) {
          const index = presets.findIndex((it) => it.id === preset.id);
          if (index === -1) {
            presets.push(preset);
          } else {
            presets[index] = preset;
          }
        }
      })
    );
  };
  const importPresets: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;
    for(const file of files) {
      reader.readAsText(file, "UTF-8");
    }
  };

  return (
    <label
      {...props}
      class={clsx(styles.PlayingPresetImporter, props.class)}
    >
      Import
      <input
        type="file"
        accept=".json"
        multiple
        onInput={importPresets}
        value="Import"
        class={styles.InvisibleFileInput}
      />
    </label>
  );
};

export default This;
