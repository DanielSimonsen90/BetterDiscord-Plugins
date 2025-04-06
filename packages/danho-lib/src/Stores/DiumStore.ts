import { React, Flux } from "@dium/modules";
import * as Data from "@dium/api/data";
import { Listener, Update, Setter } from '@dium/settings'

export type StoreType<S extends DiumStore<any>> = S["defaults"];

export class DiumStore<T extends Record<string, any>> implements Flux.StoreLike {
  /** Current item state. */
  current: T;

  /** Currently registered listeners. */
  listeners: Set<Listener<T>> = new Set();

  /**
   * Creates a new item store.
   *
   * @param defaults Default item to use initially & revert to on reset.
   * @param onLoad Optional callback for when the item are loaded.
   */
  constructor(
    public defaults: T, 
    public dataKey: string, 
    public onLoad?: () => void
  ) {
    if (!dataKey.endsWith('Store')) this.dataKey = formatStoreName(dataKey);
    this.current = { ...defaults };
  }

  /** Loads item. */
  load(): void {
    this.current = { ...this.defaults, ...Data.load(this.dataKey) };
    this.onLoad?.();
    this._dispatch(false);
  }

  /**
   * Dispatches a item update.
  *
  * @param save Whether to save the item.
  */
  _dispatch(save: boolean): void {
    for (const listener of this.listeners) {
      listener(this.current);
    }
    if (save) {
      Data.save(this.dataKey, this.current);
    }
  }

  /**
   * Updates item state.
   *
   * Similar to React's `setState()`.
   *
   * @param item Partial item or callback receiving current item and returning partial item.
   *
   * @example
   * ```js
   * Item.update({myKey: "foo"})
   * Item.update((current) => ({settingA: current.settingB}))
   * ```
   */
  update = (item: Update<T>, replace = false): void => {
    const current = replace ? {} : this.current;
    this.current = typeof item === "function"
      ? ({ ...current, ...item(this.current) }) as T
      : ({ ...current, ...item }) as T;
    this._dispatch(true);
  };

  /** Resets all item to their defaults. */
  reset(): void {
    this.current = { ...this.defaults };
    this._dispatch(true);
  }

  /** Deletes item using their keys. */
  delete(...keys: string[]): void {
    for (const key of keys) {
      delete this.current[key];
    }
    this._dispatch(true);
  }

  /**
   * Returns the current item state.
   *
   * @example
   * ```js
   * const currentItem = Item.useCurrent();
   * ```
   */
  useCurrent(): T {
    return Flux.useStateFromStores([this], () => this.current, undefined, () => false);
  }

  /**
   * Returns the current item state mapped with a selector.
   *
   * Similar to Redux' `useSelector()`, but with optional dependencies.
   *
   * @param selector A function selecting a part of the current item.
   * @param deps Dependencies of the selector.
   * @param compare An equality function to compare two results of the selector. Strict equality `===` by default.
   *
   * @example
   * ```js
   * const entry = Item.useSelector((current) => current.entry);
   * ```
   */
  useSelector<R>(selector: (current: T) => R, deps?: React.DependencyList, compare?: Flux.Comparator<R>): R {
    return Flux.useStateFromStores([this], () => selector(this.current), deps, compare);
  }

  /**
   * Returns the current item state & a setter function.
   *
   * Similar to React's `useState()`.
   *
   * @example
   * ```js
   * const [currentItem, setItem] = Item.useState();
   * ```
   */
  useState(): [T, Setter<T>] {
    return Flux.useStateFromStores([this], () => [
      this.current,
      this.update
    ]);
  }

  /**
   * Returns the current item state, defaults & a setter function.
   *
   * Similar to React's `useState()`, but with another entry.
   *
   * @example
   * ```js
   * const [currentItem, defaultItem, setItem] = Item.useStateWithDefaults();
   * ```
   */
  useStateWithDefaults(): [T, T, Setter<T>] {
    return Flux.useStateFromStores([this], () => [
      this.current,
      this.defaults,
      this.update
    ]);
  }

  /**
   * Adds a new item change listener from within a component.
   *
   * @param listener Listener function to be called when item state changes.
   * @param deps Dependencies of the listener function. Defaults to the listener function itself.
   */
  useListener(listener: Listener<T>, deps?: React.DependencyList): void {
    React.useEffect(() => {
      this.addListener(listener);
      return () => this.removeListener(listener);
    }, deps ?? [listener]);
  }

  /** Registers a new item change listener. */
  addListener(listener: Listener<T>): Listener<T> {
    this.listeners.add(listener);
    return listener;
  }

  /** Removes a previously added item change listener. */
  removeListener(listener: Listener<T>): void {
    this.listeners.delete(listener);
  }

  /** Removes all current item change listeners. */
  removeAllListeners(): void {
    this.listeners.clear();
  }

  // compatibility with discord's flux interface
  addReactChangeListener = this.addListener;
  removeReactChangeListener = this.removeListener;
}

/**
 * Creates new item.
 *
 * For details see {@link ItemStore}.
 */
export const createDiumStore = <T extends Record<string, any>>(
  defaults: T, 
  dataKey: string,
  onLoad?: () => void
): DiumStore<T> => new DiumStore(defaults, dataKey, onLoad);

function formatStoreName(name: string): string {
  const pascal = name.charAt(0).toUpperCase() + name.slice(1);
  return name.endsWith('Store')
    ? pascal
    : `${pascal}Store`;
}