import * as React from 'react';
import type { Injected } from './injected.js';

type Props = {
  item: Injected<unknown, unknown, unknown>;
};

export const InjectedComponent = React.memo(({ item }: Props) => {
  const props = React.useSyncExternalStore(item.observe, item.getProps);

  return item.renderFn({
    props: props,
    updateProps: item.updateProps,
    deferred: item.deferred,
  });
});
