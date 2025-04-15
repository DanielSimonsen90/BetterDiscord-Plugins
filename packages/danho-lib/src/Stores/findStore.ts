import { Finder } from "@injections";

export function findStore(storeName: string, allowMultiple = false) {
  const result = Object.values<{
    name: string,
    band: number,
    actionHandler: Record<string, any>,
    storeDidChange: (e: any) => void;
  }>(
    Finder.byName<any>("UserSettingsAccountStore")
      ._dispatcher._actionHandlers._dependencyGraph.nodes
  ).sort((a, b) => a.name.localeCompare(b.name))
    .filter(s => s.name.toLowerCase().includes(storeName.toLowerCase()));

  return allowMultiple
    ? result.map(store => [store.name, Finder.byName(store.name) ?? new class InvalidStore { node = store; }])
    : result.map(store =>
      Finder.byName(store.name) as { getName(): string; }
      ?? new class InvalidStore { node = store; getName() { return store.name; } }
    )[0];
}