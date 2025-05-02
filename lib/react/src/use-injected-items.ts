import { useSyncExternalStore } from 'react';

import { InjectioObserver } from './injectio-observer';

export const useInjectedItems = () => {
  const injectioObserver = InjectioObserver.getInstance();

  return useSyncExternalStore(
    injectioObserver.subscribe,
    injectioObserver.getSnapshot
  );
};
