import { Button } from './components/button';
import { injectExampleDrawer } from './components/example-drawer';
import { ModalsFlowWithDismissingButStatePersisted } from './examples/modals-flow-with-dismissing-but-state-persisted';
import { ModalsFlowWithDismissingButStateReset } from './examples/modals-flow-with-dismissing-but-state-resetted';
import { ModalsFlowWithStacking } from './examples/modals-flow-with-stacking';

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center space-y-2">
      <h1 className="text-xl fond-medium">Welcome to Injecto examples!</h1>
      <Button onClick={injectExampleDrawer}>Inject Example Drawer</Button>

      <ModalsFlowWithStacking />
      <ModalsFlowWithDismissingButStateReset />
      <ModalsFlowWithDismissingButStatePersisted />
    </div>
  );
};
