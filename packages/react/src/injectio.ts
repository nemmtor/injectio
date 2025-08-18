import { createElement, useSyncExternalStore } from 'react';
import { Core } from './internal/core.js';
import { InjectedComponent } from './internal/injected-component.js';

export const Injectio = () => {
  const core = Core.getInstance();
  const snapshot = useSyncExternalStore(core.subscribe, core.getSnapshot);
  return snapshot.map((item) =>
    createElement(InjectedComponent, { key: item.id, item }),
  );
};
