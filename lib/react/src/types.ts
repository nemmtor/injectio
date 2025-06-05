import { ReactNode } from 'react';

export type RenderFnProps<TProps, ResolvedValue> = {
  props: TProps;
  remove: VoidFunction;
  resolve: (value?: ResolvedValue) => void;
};

export type RenderFn<TProps, ResolvedValue> = (
  renderProps: RenderFnProps<TProps, ResolvedValue>
) => ReactNode;

export type UpdatePropsFn<TProps> = (updater: (currentProps: TProps) => TProps) => void;
