import { inject, UpdatePropsFn } from '@injectio/react';
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

type YetAnotherDrawerProps = {
  isOpened: boolean;
};

export const injectYetAnotherDrawer = (): { updateProps: UpdatePropsFn<YetAnotherDrawerProps> } => {
  const { updateProps } = inject<YetAnotherDrawerProps, void>(
    ({ props, remove }) => (
      <YetAnotherDrawer
        isOpened={props.isOpened}
        onClose={() => updateProps((p) => ({ ...p, isOpened: false }))}
        onCloseAnimationFinished={remove}
      />
    ),
    { isOpened: true }
  );
  return { updateProps };
};
