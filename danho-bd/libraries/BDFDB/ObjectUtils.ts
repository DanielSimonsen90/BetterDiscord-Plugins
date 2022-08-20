export type ObjectUtils = {
    exclude<T, TKeys extends keyof T>(obj: T, ...keys: Array<TKeys>): Omit<T, TKeys>;
}
export default ObjectUtils;