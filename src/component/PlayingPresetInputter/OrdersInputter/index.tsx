import clsx from "clsx";
import {
  Component,
  JSX, For,
} from "solid-js";
import { SetStoreFunction } from "solid-js/store";

import styles from "./index.module.styl";

import PlayingPreset from "@/type/PlayingPreset";

type Orders = PlayingPreset["orders"]
type Order = Orders[number]
type Props = JSX.IntrinsicElements["div"]
  & {
    orders: Orders
    setOrders: SetStoreFunction<Orders>
    onPreview: (orders: Orders) => void
  }
const This: Component<Props> = (props) => {
  const valueByInput = (event: InputEvent) => (event.target as HTMLInputElement).value;
  const addOrder = () => {
    const nextIndex = props.orders.length;
    const lastOrder = props.orders.slice(-1).find(() => true);
    const emptyOrder: Order = {
      source: "",
      time: 0,
      duration: 1,
    };
    const order = {
      ...emptyOrder,
      ...lastOrder,
    };
    props.setOrders(nextIndex, order);
  };
  const removeOrder = (index: number) => {
    props.setOrders((orders) => orders.filter((it, i) => i !== index));
  };
  const previewOrder = (order: Order) => {
    props.onPreview([order]);
    return false;
  };

  return (
    <div
      {...props}
      class={clsx(styles.OrdersInputter, props.class)}
    >
      <For each={props.orders}>{(order, index) =>
        <>
          <label
            class={styles.Full}
          >
            Source:
            <input
              type="text"
              value={order.source}
              onInput={(event) => props.setOrders(index(), "source", valueByInput(event))}
            />
          </label>
          <button
            onClick={() => removeOrder(index())}
          >🗑️</button>
          <label class={styles.Contents}>
            Time:
            <input
              type="text"
              pattern="[0-9]+(\.[0-9]+)?"
              value={order.time}
              onInput={(event) => props.setOrders(index(), "time", Number(valueByInput(event)))}
            />
          </label>
          <label class={styles.Contents}>
            Duration:
            <input
              type="text"
              pattern="[0-9]+(\.[0-9]+)?"
              value={order.duration}
              onInput={(event) => props.setOrders(index(), "duration", Number(valueByInput(event)))}
            />
          </label>
          <button
            onClick={() => previewOrder(order)}
          >▶</button>
        </>
      }</For>
      <input
        class={styles.Full}
        type="button"
        value="+"
        onClick={addOrder}
      />
    </div>
  );
};

export default This;
