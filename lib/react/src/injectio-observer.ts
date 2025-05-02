import { Injected } from './injected';
import { RenderFn } from './types';

type Subscriber = VoidFunction;

export class InjectioObserver {
  private subscribers: Subscriber[] = [];
  private injectedItems: Injected[] = [];

  public constructor() {
    this.getSnapshot = this.getSnapshot.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.add = this.add.bind(this);
    this.emit = this.emit.bind(this);
  }

  public subscribe(subscriber: Subscriber) {
    this.subscribers = [...this.subscribers, subscriber];
    return () => {
      this.subscribers = this.subscribers.filter((l) => l !== subscriber);
    };
  }

  public getSnapshot(): readonly Injected[] {
    return this.injectedItems;
  }

  public add(renderFn: RenderFn) {
    const injected = new Injected({
      renderFn,
      onSync: this.emit,
    });
    this.injectedItems = [...this.injectedItems, injected];
    this.emit();
  }

  private emit() {
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

export const injectioObserver = new InjectioObserver();
