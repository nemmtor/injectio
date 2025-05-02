import { inject } from '@injectio/react';
import { memo } from 'react';

import { Drawer, DrawerProps } from './drawer';
import { Button } from './button';

const YetAnotherDrawer = memo((drawerProps: DrawerProps) => {
  return (
    <Drawer {...drawerProps}>
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-xl font-medium">This is yet another drawer</h1>
        <Button onClick={drawerProps.onClose}>
          You can also close it here
        </Button>
      </div>
    </Drawer>
  );
});
YetAnotherDrawer.displayName = 'YetAnotherDrawer';

export const injectYetAnotherDrawer = () =>
  inject(({ dismissed, dismiss, remove }) => (
    <YetAnotherDrawer
      isOpened={!dismissed}
      onClose={dismiss}
      onCloseAnimationFinished={remove}
    />
  ));
