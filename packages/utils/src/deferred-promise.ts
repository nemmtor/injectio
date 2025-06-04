import { noop } from './noop';
export class DeferredPromise<ResolvedValue> {
  private resolvePromise: (value: ResolvedValue) => void = noop;
  private _promise: Promise<ResolvedValue>;

  private constructor() {
    this._promise = new Promise<ResolvedValue>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  public static make<Resolved>() {
    return new DeferredPromise<Resolved>();
  }

  public resolve(value: ResolvedValue) {
    this.resolvePromise(value);
  }

  public get promise() {
    return this._promise;
  }
}
