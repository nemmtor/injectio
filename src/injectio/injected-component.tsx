import { memo, useSyncExternalStore } from 'react';
import { Core } from './core';
import type { Injected } from './injected';

type Props = {
  item: Injected<unknown, unknown, unknown>;
};

const core = Core.getInstance();

export const InjectedComponent = memo(({ item }: Props) => {
  const props = useSyncExternalStore(item.subscribe, item.getProps);

  return item.renderFn({
    remove: () => core.remove(item.id),
    props: props,
    updateProps: item.updateProps,
    deferred: item.deferred,
  });
});
