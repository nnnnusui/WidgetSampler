import {
  Context,
  createContext,
  ParentComponent,
  useContext,
} from "solid-js";

type Type = unknown
const context: Context<Type> = createContext();
const use = () => { return useContext<Type>(context); };
const Provider: ParentComponent = (props) => {
  const store = {
    audioContext,
  };

  return (
    <context.Provider value={undefined}>
      {props.children}
    </context.Provider>
  );
};

export {
  use as useAudioContext,
  Provider as AudioProvider,
};
