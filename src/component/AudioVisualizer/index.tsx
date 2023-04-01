import {
  Component, createEffect, createSignal,
} from "solid-js";

import styles from "./index.module.styl";

const fftSize = 2048;

type Props = unknown
const This: Component<Props> = (props) => {
  const [getAudioContext, setAudioContext] = createSignal<AudioContext>();
  const [analyser, setAnalyser] = createSignal<AnalyserNode>();
  createEffect(() => {
    const audioContext = getAudioContext();
    if (!audioContext) return;
    const newAnalyser = audioContext.createAnalyser();
    newAnalyser.fftSize = fftSize;
    setAnalyser(newAnalyser);
  });

  const [getRef, setRef] = createSignal<HTMLCanvasElement>();
  createEffect(() => {
    const ref = getRef();
    if (!ref) return;
    ref.getContext("2d");
  });

  return (
    <canvas
      class={ styles.AudioVisualizer }
      onClick={ () => setAudioContext(new AudioContext()) }
      ref={setRef}
    />
  );
};

export default This;
