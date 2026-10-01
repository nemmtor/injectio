import { Deferred, Effect } from "effect";
import { Injected, type InjectedView, type RenderFn } from "./injected";
import { Observable, type Observer } from "./observable";
import { Store } from "./store";

export type AddArgs<A, E, P> = {
  renderFn: RenderFn<A, E, P>;
  initialProps: P;
};

export class Core {
  private static instance = new Core();
  private readonly observable = new Observable();
  private readonly store = new Store<InjectedView>();

  private constructor() {}

  public static getInstance(): Core {
    return Core.instance;
  }

  // for testing purposes only
  public static reset() {
    Core.instance = new Core();
  }

  public readonly observe = (observer: Observer) =>
    this.observable.observe(observer);

  public readonly getSnapshot = () => this.store.items;

  public remove(id: string) {
    this.store.remove(id);
    this.observable.emit();
  }

  public add<A, E, P>({ renderFn, initialProps }: AddArgs<A, E, P>) {
    return Effect.gen({ self: this }, function* () {
      const injectedId = crypto.randomUUID();
      yield* Effect.addFinalizer(() =>
        Effect.sync(() => {
          this.remove(injectedId);
        }),
      );
      const deferred = yield* Deferred.make<A, E>();

      const injected = new Injected<A, E, P>({
        id: injectedId,
        renderFn,
        deferred,
        props: initialProps,
      });

      this.store.add(injected);
      this.observable.emit();

      return {
        updateProps: injected.updateProps,
        deferred,
      };
    });
  }
}
