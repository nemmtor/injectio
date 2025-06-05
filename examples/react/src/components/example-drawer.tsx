import { inject, UpdatePropsFn } from '@injectio/react';
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

type ExampleDrawerProps = {
  isOpened: boolean;
};

export const injectExampleDrawer = (): { updateProps: UpdatePropsFn<ExampleDrawerProps> } => {
  const { updateProps } = inject<ExampleDrawerProps, void>(
    ({ props, resolve, remove }) => (
      <ExampleDrawer
        isOpened={props.isOpened}
        onClose={() => {
          resolve(undefined);
          updateProps((p) => ({ ...p, isOpened: false }));
        }}
        onCloseAnimationFinished={remove}
      />
    ),
    { isOpened: true }
  );
  return { updateProps };
};
