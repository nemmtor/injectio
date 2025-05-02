import { noop } from './noop';
export class DeferredPromise<Resolved> {
  private resolvePromise: (value: Resolved) => void = noop;
  private _promise: Promise<Resolved>;

  private constructor() {
    this._promise = new Promise<Resolved>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  public static make<Resolved>() {
    return new DeferredPromise<Resolved>();
  }

  public resolve(value: Resolved) {
    this.resolvePromise(value);
  }

  public get promise() {
    return this._promise;
  }
}
