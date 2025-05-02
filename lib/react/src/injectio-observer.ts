import { Injected } from './injected';
import { RenderFn } from './types';

type Subscriber = VoidFunction;

export class InjectioObserver {
  private static instance: InjectioObserver | undefined;
  private subscribers: Subscriber[] = [];
  private injectedItems: Injected[] = [];

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

  public getSnapshot(): readonly Injected[] {
    return this.injectedItems;
  }

  public add(renderFn: RenderFn) {
    const injected = new Injected({
      renderFn,
      onDismiss: this.notifySubscribers,
      onRemove: this.remove,
    });
    this.injectedItems = [...this.injectedItems, injected];
    this.notifySubscribers();
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
