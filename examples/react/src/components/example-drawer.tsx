import { inject } from '@injectio/react';
import { memo } from 'react';

import { Drawer, DrawerProps } from './drawer';
import { Button } from './button';
import { injectYetAnotherDrawer } from './yet-another-drawer';

const ExampleDrawer = memo((drawerProps: DrawerProps) => {
  return (
    <Drawer {...drawerProps}>
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-xl font-medium">This is an example drawer</h1>
        <p>Do you want to open another drawer?</p>
        <Button onClick={injectExampleDrawer}>
          Open another example drawer
        </Button>
        <Button onClick={injectYetAnotherDrawer}>Or yet another one</Button>
      </div>
    </Drawer>
  );
});
ExampleDrawer.displayName = 'ExampleDrawer';

export const injectExampleDrawer = () =>
  inject(({ dismissed, dismiss, resolve, remove }) => (
    <ExampleDrawer
      isOpened={!dismissed}
      onClose={() => {
        resolve(undefined);
        dismiss();
      }}
      onCloseAnimationFinished={remove}
    />
  ));
