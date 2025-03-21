type Comparator<T> = (a: T, b: T) => number;

export class SortableArray<T> extends Array<T> {
  constructor(...items: T[]) {
    super(...items);
  }

  public orderBy(...comparators: Comparator<T>[]): SortableArray<T> {
    const result = this.sort((a, b) => {
      for (const comparator of comparators) {
        const result = comparator(a, b);
        if (result !== 0) return result;
      }

      return 0;
    });

    return new SortableArray(...result);
  }

  public orderByDescending(...comparators: Comparator<T>[]): SortableArray<T> {
    const result = this.orderBy(...comparators.map(comparator => (a: T, b: T) => -comparator(a, b)));
    return new SortableArray(...result);
  }

  take(count: number): SortableArray<T> {
    const result = this.slice(0, count);
    return new SortableArray(...result);
  }
}