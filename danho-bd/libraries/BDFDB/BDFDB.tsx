import { Modules } from '../../plugins/base/ProcessEvent';
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

export type BDFDB = {
    ChannelUtils: ChannelUtils,
    ColorUtils: ColorUtils,
    DataUtils: DataUtils,
    DiscordClassModules: Record<string, string>
    DMUtils: DMUtils,
    FolderUtils: FolderUtils,
    GuilddUtils: GuildUtils,
    LibraryComponents: LibraryComponents,
    LibraryModules: LibraryModules
    MessageUtils: MessageUtils,
    PatchUtils: PatchUtils,
    PluginUtils: PluginUtils,
    ReactUtils: ReactUtils,
    TooltipUtils: TooltipUtils,
    UserUtils: UserUtils,
}
export default BDFDB;

import { useEffect, useMemo, useState } from 'react';

export function useBDFDB() {
    const loaded = useMemo<boolean>(() => (window as any).BDFDB_Global.loaded, [(window as any).BDFDB_Global.loaded]);
    const [BDFDB, setBDFDB] = useState<BDFDB>();

    useEffect(() => {
        setBDFDB(loaded ? (window as any).BDFDB : null);
    }, [loaded]);

    return BDFDB;
}