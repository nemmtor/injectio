import { ReactNode } from 'react';

type RenderFnProps = {
  dismiss: VoidFunction;
  dismissed: boolean;
  remove: VoidFunction;
};
export type RenderFn = (props: RenderFnProps) => ReactNode;
