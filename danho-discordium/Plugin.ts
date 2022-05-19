export { forceRerender } from 'danho-bd';
export { default as ZLibrary } from 'danho-bd/libraries/ZLibrary';
export { default as BDFDB} from 'danho-bd/libraries/BDFDB';
export { default as $ } from './dquery';
export { React, createPlugin } from 'discordium';
export { Discord } from 'discordium/api';

import { Config, CreatePluginCallbackApi, Logger, Patcher, Plugin, Styles } from 'discordium';
import { Settings, Data } from 'discordium/api';

import { ObservationCallback, ObservationConfig } from './MutationManager';
import MutationManager, { MutationConfigOptions, ObservationReturns } from './MutationManager/MutationManager';
import ContextMenuProvider from './ContextMenuProvider';
import initializePatches, { Patched, PatcherConfig } from './Patcher';

export type MutationConfig = Partial<Record<MutationConfigOptions, string>>;
export type MutationRecordCallback = (record: MutationRecord) => boolean;

type Layers = 'tooltip' | 'modal' | 'popout' | `create${'Channel' | 'Category'}`;
/**
 * Options object or string for displayName or strings for props
 */

export class DanhoPlugin<
    SettingsType extends Record<string, any>,
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

    public patches: Array<Patched>;
    protected mutationManager: MutationManager;
    protected contextMenus: ContextMenuProvider;

    public async start(config?: PatcherConfig) {
        console.clear();

        this.mutationManager = new MutationManager()
            // .on('guild-change', (record, guild) => this.onGuildChange(record, guild))
            // .on('channel-change', (record, { channel }) => this.onChannelUpdate(record, channel))

        /*
        for (const [key, value] of Object.entries(config)) {
            this.mutationManager.observe(key, this[value].bind(this));
        }
        */

        this.patches = await initializePatches(this, config);
        // this.contextMenus = ContextMenuProvider.getInstance(this);
    }
    public stop() {
        this.mutationManager.clear();
        this.patcher.unpatchAll();
    }

    protected on<
        Observation extends MutationConfigOptions | ObservationConfig<any> = MutationConfigOptions,
        Arguments extends Observation extends MutationConfigOptions ? ObservationReturns[Observation] : never = Observation extends MutationConfigOptions ? ObservationReturns[Observation] : never,
    >(observation: Observation, callback: ObservationCallback<Arguments>) {
        return this.mutationManager.on(observation, callback);
    }
    protected off(observation: MutationConfigOptions) {
        return this.mutationManager.off(observation);
    }
}
export default DanhoPlugin;