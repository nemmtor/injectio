type WithId = {
  id: string;
};

export class Store<Item extends WithId> {
  private items: Item[] = [];

  public add(item: Item) {
    // reference update is needed in order to re-render React
    this.items = [...this.items, item];
  }

  public remove(id: string) {
    // reference update is needed in order to re-render React
    this.items = this.items.filter((item) => item.id !== id);
  }

  public getSnapshot(): readonly Item[] {
    return this.items;
  }
}
