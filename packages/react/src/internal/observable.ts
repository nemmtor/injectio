export type Observer = VoidFunction;

export class Observable {
  protected observers: Observer[] = [];

  public emit() {
    for (const subscriber of this.observers) {
      subscriber();
    }
  }

  public observe(observer: Observer) {
    this.observers.push(observer);

    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }
}
