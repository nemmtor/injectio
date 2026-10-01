import * as React from "react";
import { Core } from "./internal/core";
import { InjectedComponent } from "./internal/injected-component";

export const Injectio = () => {
  const core = Core.getInstance();
  const items = React.useSyncExternalStore(core.observe, core.getSnapshot);
  return items.map((item) =>
    React.createElement(InjectedComponent, { key: item.id, item }),
  );
};
