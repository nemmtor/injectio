import type { Deferred } from "effect";
import type * as React from "react";
import { Observable, type Observer } from "./observable";

type RenderFnProps<A, E, P> = {
  deferred: Deferred.Deferred<A, E>;
  props: P;
  updateProps: (props: Partial<P>) => void;
};

export type RenderFn<A, E, P> = (
  props: RenderFnProps<A, E, P>,
) => React.ReactNode;

export type InjectedView = {
  readonly id: string;
  observe: (observer: Observer) => VoidFunction;
  getProps: () => unknown;
  render: () => React.ReactNode;
};

type ConstructorArgs<A, E, P> = {
  id: string;
  props: P;
  renderFn: RenderFn<A, E, P>;
  deferred: Deferred.Deferred<A, E>;
};

export class Injected<A, E, P> implements InjectedView {
  private readonly observable = new Observable();

  public readonly id: string;
  public readonly renderFn: RenderFn<A, E, P>;
  public readonly deferred: Deferred.Deferred<A, E>;
  private props: P;

  constructor({ id, props, deferred, renderFn }: ConstructorArgs<A, E, P>) {
    this.id = id;
    this.renderFn = renderFn;
    this.deferred = deferred;
    this.props = props;
  }

  public readonly updateProps = (props: Partial<P>) => {
    this.props = { ...this.props, ...props };
    this.observable.emit();
  };

  public readonly observe = (observer: Observer) =>
    this.observable.observe(observer);

  public readonly getProps = () => this.props;

  public readonly render = () =>
    this.renderFn({
      props: this.props,
      updateProps: this.updateProps,
      deferred: this.deferred,
    });
}
