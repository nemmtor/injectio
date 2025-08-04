import { type AddArgs, Core } from './core';

export const inject = <A, E = never, P = Record<string, never>>(
  args: AddArgs<A, E, P>,
) => {
  const core = Core.getInstance();

  return core.add<A, E, P>(args);
};
