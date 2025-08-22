import * as Deferred from 'effect/Deferred';
import * as Effect from 'effect/Effect';
import * as uuid from 'uuid';
import { Injected, type RenderFn } from './injected.js';
import { Observable, type Observer } from './observable.js';
import { Store } from './store.js';

export type AddArgs<A, E, P> = {
  renderFn: RenderFn<A, E, P>;
  initialProps: P;
};

export class Core {
  private static instance = new Core();
  private readonly observable = new Observable();
  private readonly store = new Store<Injected<unknown, unknown, unknown>>();

  private constructor() {
    this.getSnapshot = this.getSnapshot.bind(this);
    this.observe = this.observe.bind(this);
  }

  public static getInstance(): Core {
    return Core.instance;
  }

  // for testing purposes only
  public static reset() {
    Core.instance = new Core();
  }

  public observe(observer: Observer) {
    return this.observable.observe(observer);
  }

  public getSnapshot() {
    return this.store.items;
  }

  public remove(id: string) {
    this.store.remove(id);
    this.observable.emit();
  }

  public add<A, E, P>({ renderFn, initialProps }: AddArgs<A, E, P>) {
    return Effect.gen(this, function* () {
      const injectedId = uuid.v4();
      yield* Effect.addFinalizer(() => {
        return Effect.sync(() => this.remove(injectedId));
      });
      const deferred = yield* Deferred.make<A, E>();

      const injected = new Injected<A, E, P>({
        id: injectedId,
        renderFn,
        deferred,
        props: initialProps,
      });

      this.store.add(injected as Injected<unknown, unknown, unknown>);
      this.observable.emit();

      return {
        updateProps: injected.updateProps,
        deferred,
      };
    });
  }
}
