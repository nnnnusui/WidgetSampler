import clsx from "clsx";
import {
  Component,
  JSX,
  createSignal,
} from "solid-js";

import styles from "./index.module.styl";

import PlayingPreset from "@/type/PlayingPreset";

type Props = JSX.IntrinsicElements["button"]
  & {
    presets: PlayingPreset[]
  }
const This: Component<Props> = (props) => {
  const [downloadLinkRef, setDownloadLinkRef] = createSignal<HTMLAnchorElement>();
  const exportPresets = () => {
    const ref = downloadLinkRef();
    if (!ref) return;
    const json = JSON.stringify(props.presets, null, "  ");
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    ref.href = url;
    const fileName = Date.now();
    ref.download = `${fileName}.json`;
    ref.click();
  };

  return (
    <button
      {...props}
      class={clsx(styles.PlayingPresetExporter, props.class)}
      onClick={exportPresets}
    >
      Export
      <a ref={setDownloadLinkRef} />
    </button>
  );
};

export default This;
