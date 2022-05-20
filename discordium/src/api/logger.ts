export type Output = (...data: any[]) => void;

export interface Logger {
    groupEnd(): void;
    group(label: string, collapsed?: boolean): void;
    /** Prints data to a custom output. */
    print(output: Output, ...data: any[]): void;

    /** Logs a message to the console. */
    log: Output;

    /** Logs a warning to the console. */
    warn: Output;

    /** Logs an error to the console. */
    error: Output;
}

export const createLogger = (name: string, color: string, version: string): Logger => {
    const print = (output: Output, ...data: any[]) => output(
        `%c[${name}] %c${version ? `(v${version})` : ""}`,
        `color: ${color}; font-weight: 700;`,
        "color: #666; font-size: .8em;",
        ...data
    );
    return {
        print,
        log: (...data) => print(console.log, ...data),
        warn: (...data) => print(console.warn, ...data),
        error: (...data) => print(console.error, ...data),
        group: (label, collapsed = true) => print(console[(collapsed ? 'groupCollapsed' : 'group')], label),
        groupEnd: () => print(console.groupEnd),
    };
};
