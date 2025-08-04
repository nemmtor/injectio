import { useSyncExternalStore } from 'react';

import { Core } from './core';
import { InjectedComponent } from './injected-component';

const core = Core.getInstance();
export const Injectio = () => {
  const snapshot = useSyncExternalStore(core.subscribe, core.getSnapshot);

  return snapshot.map((item) => (
    <InjectedComponent key={item.id} item={item} />
  ));
};
