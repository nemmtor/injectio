import { memo, useSyncExternalStore } from 'react';
import type { Injected } from './injected';

type Props = {
  item: Injected<unknown, unknown, unknown>;
};

export const InjectedComponent = memo(({ item }: Props) => {
  const props = useSyncExternalStore(item.subscribe, item.getProps);

  return item.renderFn({
    props: props,
    updateProps: item.updateProps,
    deferred: item.deferred,
  });
});
