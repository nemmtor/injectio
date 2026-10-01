import * as React from "react";
import type { InjectedView } from "./injected";

type Props = {
  item: InjectedView;
};

export const InjectedComponent = React.memo(({ item }: Props) => {
  React.useSyncExternalStore(item.observe, item.getProps);

  return item.render();
});
