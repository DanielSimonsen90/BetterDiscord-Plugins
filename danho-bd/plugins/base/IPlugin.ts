export default interface IPlugin {
    start(): void;
    load(): void;
    stop(): void;
    observer(changes: MutationRecord): void;
}