import {getMeta} from "../meta";

const COLOR = "#3a71c1";

/** Prints data to a custom output. */
export const print = (output: (...data: any[]) => void, ...data: any[]): void => output(
    `%c[${getMeta().name}] %c${getMeta().version ? `(v${getMeta().version})` : ""}`,
    `color: ${COLOR}; font-weight: 700;`,
    "color: #666; font-size: .8em;",
    ...data
);

/** Logs a message to the console. */
export const log = (...data: any[]): void => print(console.log, ...data);

/** Logs a warning to the console. */
export const warn = (...data: any[]): void => print(console.warn, ...data);

/** Logs an error to the console. */
export const error = (...data: any[]): void => print(console.error, ...data);

/** Groups data in the console. */
export const group = (label: string, ...data: any[]): void => print(console.group, label, ...data);

/** Groups data in the console, but collapsed. */
export const groupCollapsed = (label: string, ...data: any[]): void => print(console.groupCollapsed, label, ...data);

/** Ends the current group. */
export const groupEnd = (): void => console.groupEnd();