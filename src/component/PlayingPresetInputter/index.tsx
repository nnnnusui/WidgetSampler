import clsx from "clsx";
import {
  Component,
  JSX,
} from "solid-js";
import { SetStoreFunction } from "solid-js/store";

import styles from "./index.module.styl";
import OrdersInputter from "./OrdersInputter";

import PlayingPreset from "@/type/PlayingPreset";

type Props = JSX.IntrinsicElements["div"]
  & {
    preset: PlayingPreset
    setPreset: SetStoreFunction<PlayingPreset>
    onSubmit: () => void
    onPreview: (orders: PlayingPreset["orders"]) => void
  }
const This: Component<Props> = (props) => {
  const valueByInput = (event: InputEvent) => (event.target as HTMLInputElement).value;
  const id = () => props.preset.id;
  const name = () => props.preset.name;
  const setName = (event: InputEvent) => props.setPreset("name", valueByInput(event));
  const bgColor = () => props.preset.bgColor;
  const setBgColor = (event: InputEvent) => props.setPreset("bgColor", valueByInput(event));
  const opacity = () => props.preset.opacity;
  const setOpacity = (event: InputEvent) => props.setPreset("opacity", Number(valueByInput(event)));
  const orders = () => props.preset.orders;
  const setOrders: SetStoreFunction<PlayingPreset["orders"]>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    = (...args: unknown[]) => props.setPreset("orders", ...args);

  return (
    <div
      class={styles.PlayingPresetInputter}
    >
      <p class={clsx(styles.Id, styles.Full)}>
        {id()}
      </p>
      <label>
        Name:
        <input
          type="text"
          value={name()}
          onInput={setName}
        />
      </label>
      <label>
        BgColor:
        <input type="color"
          value={bgColor()}
          onInput={setBgColor}
        />
      </label>
      <label>
        Opacity:
        <input
          type="text"
          pattern="1|0|0\.[0-9]+?"
          value={opacity()}
          onInput={setOpacity}
        />
      </label>
      <OrdersInputter
        orders={orders()}
        setOrders={setOrders}
        onPreview={props.onPreview}
        class={styles.Full}
      />
      <input
        class={styles.Full}
        type="button"
        value="done"
        onClick={() => props.onSubmit()}
      />
    </div>
  );
};

export default This;
