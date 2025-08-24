export type Observer = VoidFunction;

export class Observable {
  private observers: Observer[] = [];

  public emit() {
    for (const observer of this.observers) {
      observer();
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
