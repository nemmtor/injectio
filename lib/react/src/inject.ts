import { InjectioObserver } from './injectio-observer';
import { RenderFn } from './types';

export const inject = <ResolvedValue>(
  renderFn: RenderFn<ResolvedValue>,
  id?: string
) => InjectioObserver.getInstance().add(renderFn, id);
