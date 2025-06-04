import { ReactNode } from 'react';

type RenderFnProps<ResolvedValue> = {
  dismiss: VoidFunction;
  dismissed: boolean;
  remove: VoidFunction;
  resolve: (value?: ResolvedValue) => void;
};
export type RenderFn<ResolvedValue> = (
  props: RenderFnProps<ResolvedValue>
) => ReactNode;
