import { v4 } from 'uuid';

import { RenderFn } from './types';

type ConstructorArgs = {
  renderFn: RenderFn;
  onSync: VoidFunction;
};

export class Injected {
  private _id: string;
  private _renderFn: RenderFn;
  private _dismissed = false;
  private onSync: VoidFunction;

  constructor({ renderFn, onSync }: ConstructorArgs) {
    this._id = v4();
    this._renderFn = renderFn;
    this.onSync = onSync;
    this.dismiss = this.dismiss.bind(this);
  }

  public get id() {
    return this._id;
  }

  public get renderFn() {
    return this._renderFn;
  }

  public dismiss() {
    this._dismissed = true;
    this.onSync();
  }

  public get dismissed() {
    return this._dismissed;
  }
}
