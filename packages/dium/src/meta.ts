// @ts-nocheck
import { DanhoMeta } from '../../danho-lib/src/Injections/meta';

export type Meta = DanhoMeta;

/** Meta of this plugin. */
// let meta: Meta = null;

/**
 * Returns the plugin meta.
 *
 * This will throw an error when accessed before the plugin was initialized.
 */
export const getMeta = (): Meta => {
    if (meta) {
        return meta;
    } else {
        throw Error("Accessing meta before initialization");
    }
};

/**
 * Updates the plugin meta.
 *
 * This is populated with information automatically, but can be called manually as well.
 */
export const setMeta = (newMeta: Meta): void => {
    meta = newMeta;
};
