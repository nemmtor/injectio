import { Fragment } from 'react';

import { useInjectedItems } from './use-injected-items';

export const Injectio = () => {
  const injectedItems = useInjectedItems();

  return injectedItems.map((item) => (
    <Fragment key={item.id}>
      {item.renderFn({ onDismiss: item.dismiss, dismissed: item.dismissed })}
    </Fragment>
  ));
};
