// we assume bd env for now

export interface Data<
    Content extends Record<string, any>
> {
    /** Loads a data from a key. */
    load<K extends keyof Content>(key: K): Content[K];

    /** Saves data to a key. */
    save<K extends keyof Content>(key: K, value: Content[K]): void;

    /** Deletes data stored under a key. */
    delete<K extends keyof Content>(key: K): void;
}

export const createData = <Content>(id: string): Data<Content> => ({
    load: (key) => BdApi.loadData(id, key as string) ?? null,
    save: (key, value) => BdApi.saveData(id, key as string, value),
    delete: (key) => BdApi.deleteData(id, key as string),
});
