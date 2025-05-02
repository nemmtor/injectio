import { useSyncExternalStore } from 'react';

import { injectioObserver } from './injectio-observer';

export const useInjectedItems = () => {
  return useSyncExternalStore(
    injectioObserver.subscribe,
    injectioObserver.getSnapshot
  );
};
