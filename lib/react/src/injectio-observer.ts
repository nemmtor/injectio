import { DeferredPromise } from '@injectio/utils';

import { Injected } from './injected';
import { RenderFn, UpdatePropsFn } from './types';

type Subscriber = VoidFunction;

export class InjectioObserver {
  private static instance?: InjectioObserver;
  private subscribers: Subscriber[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private injectedItems: Injected<any, any>[] = [];

  private constructor() {
    this.getSnapshot = this.getSnapshot.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.notifySubscribers = this.notifySubscribers.bind(this);
  }

  // for testing
  public static getNewInstance(): InjectioObserver {
    InjectioObserver.instance = new InjectioObserver();
    return InjectioObserver.instance;
  }

  public static getInstance(): InjectioObserver {
    if (!InjectioObserver.instance) {
      InjectioObserver.instance = new InjectioObserver();
    }

    return InjectioObserver.instance;
  }

  public subscribe(subscriber: Subscriber) {
    this.subscribers = [...this.subscribers, subscriber];
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== subscriber);
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getSnapshot(): readonly Injected<any, any>[] {
    return this.injectedItems;
  }

  public add<TProps, ResolvedValue>(
    renderFn: RenderFn<TProps, ResolvedValue>,
    initialProps: TProps,
    id?: string
  ) {
    const valueDeferredPromise = DeferredPromise.make<ResolvedValue>();

    const foundInjected = this.injectedItems.find(
      (injected) => injected.id === id
    );
    foundInjected?.override({
      onResolve: (value: unknown) =>
        valueDeferredPromise.resolve(value as ResolvedValue),
    });

    const injected =
      foundInjected ??
      new Injected({
        id,
        renderFn,
        initialProps,
        onPropsUpdate: () => {
          this.notifySubscribers();
        },
        onRemove: this.remove,
        onResolve: (value: unknown) =>
          valueDeferredPromise.resolve(value as ResolvedValue),
      });

    if (!foundInjected) {
      this.injectedItems = [...this.injectedItems, injected];
      this.notifySubscribers();
    }

    const updateProps: UpdatePropsFn<TProps> = (updater) => {
      injected.updateProps(updater);
    };

    return {
      value: valueDeferredPromise.promise,
      updateProps,
      resolve: injected.resolve,
    };
  }

  private remove(id: string) {
    this.injectedItems = this.injectedItems.filter((item) => item.id !== id);
    this.notifySubscribers();
  }

  private notifySubscribers() {
    this.updateSnapshotReference();
    for (const subscriber of this.subscribers) {
      subscriber();
    }
  }

  // needed so subscribers react on changes done inside injected items, for example updating "dismissed"
  private updateSnapshotReference() {
    this.injectedItems = [...this.injectedItems];
  }
}
