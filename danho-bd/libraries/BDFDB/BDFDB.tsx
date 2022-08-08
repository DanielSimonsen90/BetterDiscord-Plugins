import { Modules } from 'archived/danho-bd/plugins/base/ProcessEvent';
import ZLibrary from '../ZLibrary';

export type BDFDBPluginParams = [Plugin: any, BDFDB: BDFDB, ZLibrary: ZLibrary];
export type PatchTypes = 'before' | 'after';
export type MethodNames = "default" | "type" | "componentDidMount" | "componentDidUpdate" | "componentWillUnmount" | "render";
export type PatchedModules = Partial<Record<
    PatchTypes,
    Partial<Record<
        Modules,
        MethodNames
    >>
>>

import LibraryComponents from './LibraryComponents';
import ReactUtils from './ReactUtils';
import LibraryModules from './LibraryModules/LibraryModules';
import MessageUtils from './MessageUtils';
import PatchUtils from './PatchUtils';
import PluginUtils from './PluginUtils';
import TooltipUtils from './TooltipUtils';
import DataUtils from './DataUtils';
import UserUtils from './UserUtils';
import GuildUtils from './GuildUtils';
import FolderUtils from './FolderUtils';
import ChannelUtils from './ChannelUtils';
import DMUtils from './DMUtils';
import ColorUtils from './ColorUtils';
import DOMUtils from './DOMUtils';
import { ModalUtils } from './ModalUtils';

export type BDFDB = {
    ChannelUtils: ChannelUtils,
    ColorUtils: ColorUtils,
    DataUtils: DataUtils,
    DiscordClassModules: Record<string, Record<string, string>>,
    disCN: any,
    DMUtils: DMUtils,
    DOMUtils: DOMUtils
    FolderUtils: FolderUtils,
    GuildUtils: GuildUtils,
    LibraryComponents: LibraryComponents,
    LibraryModules: LibraryModules
    MessageUtils: MessageUtils,
    ModalUtils: ModalUtils,
    PatchUtils: PatchUtils,
    PluginUtils: PluginUtils,
    ReactUtils: ReactUtils,
    TooltipUtils: TooltipUtils,
    UserUtils: UserUtils,
}

export default BDFDB;