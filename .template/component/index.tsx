import clsx from "clsx";
import {
  Component,
  JSX,
} from "solid-js";

import styles from "./index.module.styl";

type Props = JSX.IntrinsicElements["div"]
  & unknown
const This: Component<Props> = (props) => {

  return (
    <div
      {...props}
      class={clsx(styles.{{properCase name}}, props.class)}
    >
      no impl
    </div>
  );
};

export default This;
