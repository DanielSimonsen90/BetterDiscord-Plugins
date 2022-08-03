export { forceRerender } from 'danho-bd';
export { default as ZLibrary } from '@ZLibrary';
export { default as BDFDB} from '@BDFDB';
export { default as $ } from '@dquery';
export * as Discord from './Discord';

export type MutationRecordCallback = (record: MutationRecord) => boolean;
export type PluginConfig = PatcherConfig;

import { Config, CreatePluginCallbackApi, Logger, Patcher, Plugin, Styles, Data, Settings } from 'discordium';
import ContextMenuProvider from './ContextMenuProvider';
import initializePatches, { Patched, PatcherConfig } from './Patcher/Patcher';
import { ComponentType } from 'react';

export class DanhoPlugin<
    SettingsType extends Record<string, any> = Record<string, any>,
    DataType extends Record<"settings", SettingsType> = Record<"settings", SettingsType>
> implements Omit<Plugin, 'start'> {
    constructor({ Config, Data, Logger, Patcher, Settings, Styles }: CreatePluginCallbackApi<SettingsType, DataType>) {
        this.config = Config;
        this.data = Data;
        this.logger = Logger;
        this.patcher = Patcher;
        this.settings = Settings;
        this.styles = Styles;
    }
    
    public config: Config<SettingsType>;
    public data: Data<DataType>;
    public logger: Logger;
    public patcher: Patcher;
    public settings: Settings<SettingsType, DataType>;
    public styles: Styles;

    public patches: Array<Patched>;
    protected contextMenus: ContextMenuProvider;

    public async start(config?: PluginConfig) {
        this.logger.group("Patches");
        this.patches = await initializePatches(this, config);
        this.contextMenus = ContextMenuProvider.getInstance(this);
        this.logger.groupEnd();
        this.logger.groupEnd();
    }
    public stop() {

    }

    protected get BDFDB() {
        return window.BDFDB;
    }
    protected get ZLibrary() {
        return window.ZLibrary;
    }
    protected get BDD() {
        return window.BDD;
    }

    settingsPanel?: ComponentType<SettingsType>;

    private events = new Map<string, Array<(...args: any[]) => void>>();
    protected on(event: string, callback: (...args: any[]) => void) {
        this.events.set(event, [...this.events.get(event) || [], callback]);
    }
    protected off(event: string, callback: (...args: any[]) => void) {
        this.events.set(event, this.events.get(event)?.filter(e => e !== callback));
    }
    protected emit(event: string, ...args: any[]) {
        // console.trace(`[${this.config.name}] Emitting event ${event}`, ...args);
        this.events.get(event)?.forEach(e => e(...args));
    }
}
export default DanhoPlugin;