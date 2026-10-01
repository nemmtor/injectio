type WithId = {
  id: string;
};

export class Store<Item extends WithId> {
  private snapshot: Item[] = [];

  public add(item: Item) {
    // reference update is needed in order to re-render React
    this.snapshot = [...this.snapshot, item];
  }

  public remove(id: string) {
    // reference update is needed in order to re-render React
    this.snapshot = this.snapshot.filter((item) => item.id !== id);
  }

  public get items(): readonly Item[] {
    return this.snapshot;
  }
}
