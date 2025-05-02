import { InjectioObserver } from './injectio-observer';
import { RenderFn } from './types';

export const inject = (renderFn: RenderFn) =>
  InjectioObserver.getInstance().add(renderFn);
