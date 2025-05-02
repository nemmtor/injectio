import { ReactNode } from 'react';

type RenderFnProps = {
  onDismiss: () => void;
  dismissed: boolean;
};
export type RenderFn = (props: RenderFnProps) => ReactNode;
