type WithId = {
  id: string;
};

export class Store<Item extends WithId> {
  private _items: Item[] = [];

  public add(item: Item) {
    // reference update is needed in order to re-render React
    this._items = [...this._items, item];
  }

  public remove(id: string) {
    // reference update is needed in order to re-render React
    this._items = this._items.filter((item) => item.id !== id);
  }

  public get items(): readonly Item[] {
    return this._items;
  }
}
