import { v4 } from 'uuid';

import { RenderFn } from './types';

type ConstructorArgs = {
  renderFn: RenderFn;
  onDismiss: VoidFunction;
  onRemove: (id: string) => void;
};

export class Injected {
  private _id: string;
  private _renderFn: RenderFn;
  private _dismissed = false;
  private onDismiss: VoidFunction;
  private onRemove: (id: string) => void;

  constructor({ renderFn, onDismiss, onRemove }: ConstructorArgs) {
    this._id = v4();
    this._renderFn = renderFn;
    this.onDismiss = onDismiss;
    this.onRemove = onRemove;
    this.dismiss = this.dismiss.bind(this);
    this.remove = this.remove.bind(this);
  }

  public get id() {
    return this._id;
  }

  public get renderFn() {
    return this._renderFn;
  }

  public dismiss() {
    this._dismissed = true;
    this.onDismiss();
  }

  public get dismissed() {
    return this._dismissed;
  }

  public remove() {
    this.onRemove(this.id);
  }
}
