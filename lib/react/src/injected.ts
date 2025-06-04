import { v4 } from 'uuid';

import { RenderFn } from './types';

type ConstructorArgs<ResolvedValue> = {
  id?: string;
  renderFn: RenderFn<ResolvedValue>;
  onDismiss: VoidFunction;
  onRemove: (id: string) => void;
  onResolve: (value: ResolvedValue) => void;
};

type OverrideArgs<ResolvedValue> = Pick<
  ConstructorArgs<ResolvedValue>,
  'onResolve'
>;

export class Injected<ResolvedValue> {
  private _id: string;
  private _renderFn: RenderFn<ResolvedValue>;
  private _dismissed = false;
  private onDismiss: () => void;
  private onRemove: (id: string) => void;
  private onResolve: (value: ResolvedValue) => void;

  constructor({
    id,
    renderFn,
    onDismiss,
    onRemove,
    onResolve,
  }: ConstructorArgs<ResolvedValue>) {
    this._id = id ?? v4();
    this._renderFn = renderFn;
    this.onDismiss = onDismiss;
    this.onRemove = onRemove;
    this.onResolve = onResolve;
    this.dismiss = this.dismiss.bind(this);
    this.remove = this.remove.bind(this);
    this.resolve = this.resolve.bind(this);
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

  public resolve(value: ResolvedValue) {
    this.onResolve(value);
  }

  public override({ onResolve }: OverrideArgs<ResolvedValue>) {
    this.onResolve = onResolve;
  }
}
