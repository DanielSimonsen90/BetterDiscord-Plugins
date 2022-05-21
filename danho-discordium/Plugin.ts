export { forceRerender } from 'danho-bd';
export { default as ZLibrary } from '@ZLibrary';
export { default as BDFDB} from '@BDFDB';
export { default as $ } from '@dquery';
export { React, ReactDOM, createPlugin } from 'discordium';
export * as Discord from './Discord';

export type MutationRecordCallback = (record: MutationRecord) => boolean;
export type PluginConfig = PatcherConfig & MutationConfig;

import { Config, CreatePluginCallbackApi, Logger, Patcher, Plugin, Styles, Data, Settings } from 'discordium';
import { ObservationCallback, ObservationConfig } from './MutationManager';
import MutationManager, { initializeMutations, MutationConfig, MutationConfigOptions, ObservationReturns } from './MutationManager/MutationManager';
import ContextMenuProvider from './ContextMenuProvider';
import initializePatches, { Patched, PatcherConfig } from './Patcher/Patcher';

type Layers = 'tooltip' | 'modal' | 'popout' | `create${'Channel' | 'Category'}`;
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

    public async start(config?: PluginConfig) {
        console.clear();

        this.logger.group("Patches");
        const { mutations, ...patchConfig } = config;
        this.mutationManager = initializeMutations(this, {mutations});
        this.patches = await initializePatches(this, patchConfig);
        this.contextMenus = ContextMenuProvider.getInstance(this);
        this.logger.groupEnd();
    }
    public stop() {
        this.mutationManager.clear();
    }

    protected get BDFDB() {
        return window.BDFDB;
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