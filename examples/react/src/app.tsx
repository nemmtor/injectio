import { Button } from './components/button';
import { injectExampleDrawer } from './components/example-drawer';

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <h1 className="text-xl fond-medium">Welcome to Injecto examples!</h1>
      <Button onClick={injectExampleDrawer}>Inject Example Drawer</Button>
    </div>
  );
};
