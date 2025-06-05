import { v4 } from 'uuid';

import { RenderFn } from './types';

type ConstructorArgs<TProps, ResolvedValue> = {
  id?: string;
  renderFn: RenderFn<TProps, ResolvedValue>;
  initialProps: TProps;
  onPropsUpdate: VoidFunction;
  onRemove: (id: string) => void;
  onResolve: (value: ResolvedValue) => void;
};

type OverrideArgs<ResolvedValue> = {
  onResolve: (value: ResolvedValue) => void;
};

export class Injected<TProps, ResolvedValue> {
  private _id: string;
  private _renderFn: RenderFn<TProps, ResolvedValue>;
  private _props: TProps;
  private onPropsUpdate: VoidFunction;
  private onRemove: (id: string) => void;
  private onResolve: (value: ResolvedValue) => void;

  constructor({
    id,
    renderFn,
    initialProps,
    onPropsUpdate,
    onRemove,
    onResolve,
  }: ConstructorArgs<TProps, ResolvedValue>) {
    this._id = id ?? v4();
    this._renderFn = renderFn;
    this._props = initialProps;
    this.onPropsUpdate = onPropsUpdate;
    this.onRemove = onRemove;
    this.onResolve = onResolve;
    this.updateProps = this.updateProps.bind(this);
    this.remove = this.remove.bind(this);
    this.resolve = this.resolve.bind(this);
  }

  public get id() {
    return this._id;
  }

  public get renderFn() {
    return this._renderFn;
  }

  public get props() {
    return this._props;
  }

  public updateProps(updater: (currentProps: TProps) => TProps) {
    this._props = updater(this._props);
    this.onPropsUpdate();
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
