declare module "*.scss" {
    const contents: string;
    export default contents;
}

declare namespace BdApi {
    const Plugins: {
        enable(pluginName: string): void
        reload(pluginName: string): void
        disable(pluginName: string): void
        toggle(pluginName: string): void

        isEnabled(pluginName: string): boolean

        get folder(): string
        get(pluginName: string): Plugin
        getAll(): Array<Plugin>
    }
}