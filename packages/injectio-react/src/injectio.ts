import { useSyncExternalStore, createElement } from "react";
import { Core } from "./internal/core.js";
import { InjectedComponent } from "./internal/injected-component.js";

const core = Core.getInstance();

export const Injectio = () => {
  const snapshot = useSyncExternalStore(core.subscribe, core.getSnapshot);
  return snapshot.map((item) =>
    createElement(InjectedComponent, { key: item.id, item })
  );
};
