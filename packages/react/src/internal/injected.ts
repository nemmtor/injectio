import type * as Deferred from 'effect/Deferred';
import type * as React from 'react';
import { Observable, type Observer } from './observable.js';

type RenderFnProps<A, E, P> = {
  deferred: Deferred.Deferred<A, E>;
  props: P;
  updateProps: (props: Partial<P>) => void;
};

export type RenderFn<A, E, P> = (
  props: RenderFnProps<A, E, P>,
) => React.ReactNode;

type ConstructorArgs<A, E, P> = {
  id: string;
  props: P;
  renderFn: RenderFn<A, E, P>;
  deferred: Deferred.Deferred<A, E>;
};

export class Injected<A, E, P> {
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
    this.updateProps = this.updateProps.bind(this);
    this.getProps = this.getProps.bind(this);
    this.observe = this.observe.bind(this);
  }

  public updateProps(props: Partial<P>) {
    this.props = { ...this.props, ...props };
    this.observable.emit();
  }

  public observe(observer: Observer) {
    return this.observable.observe(observer);
  }

  public getProps() {
    return this.props;
  }
}
