import { InjectioObserver } from './injectio-observer';
import { RenderFn } from './types';

export const inject = <TProps, ResolvedValue = void>(
  renderFn: RenderFn<TProps, ResolvedValue>,
  initialProps: TProps,
  id?: string
) => InjectioObserver.getInstance().add(renderFn, initialProps, id);
