export { forceRerender } from 'danho-bd';
export { default as ZLibrary } from '@ZLibrary';
export { default as BDFDB} from '@BDFDB';
export { default as $ } from '@dquery';
export * as Discord from './Discord';

export type MutationRecordCallback = (record: MutationRecord) => boolean;
export type PluginConfig<Settings> = PatcherConfig<Settings>;

import { Config, CreatePluginCallbackApi, Logger, Patcher, Plugin, Styles, Data, Settings, Finder } from 'discordium';
import ContextMenuProvider from './ContextMenuProvider';
import initializePatches, { Patched, PatcherConfig } from './Patcher/Patcher';
import SettingsProps from './SettingsProps';

export class DanhoPlugin<
    SettingsType extends Record<string, any> = Record<string, any>,
    DataType extends Record<"settings", SettingsType> = Record<"settings", SettingsType>
> implements Omit<Plugin<SettingsType>, 'start'> {
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
    public finder = Finder

    public patches: Array<Patched>;
    protected contextMenus: ContextMenuProvider<SettingsType, DataType>;

    public async start(config?: PluginConfig<SettingsType>) {
        this.patches = await initializePatches<SettingsType>(this, config);
        this.contextMenus = ContextMenuProvider.getInstance<SettingsType, DataType>(this);
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

    public settingsPanel?: (props: SettingsProps<SettingsType>) => JSX.Element;
    // @ts-ignore
    public SettingsPanel = (props: SettingsType) => {
        const [current, defaults, set] = this.settings.useStateWithDefaults();
        return this.settingsPanel ? this.settingsPanel({ ...props, ...current, defaults, set }) : null;
    }

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