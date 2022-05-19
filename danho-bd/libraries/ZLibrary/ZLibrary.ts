import { TransformType } from 'danholibraryjs';
import ContextMenu from './ContextMenu';
import DiscordClassModules from './DiscordClassModules';
import DiscordModules from './DiscordModules';
import { ObservationNode } from '../React'
import WebpackModules from './WebpackModules';
import Patcher from './Patcher';

export type TooltipCreateOptions = {
    style?: string,
    side?: 'top' | 'bottom' | 'left' | 'right',
    preventFlip?: boolean,
    isTimestamp?: boolean,
    disablePointerEvents?: boolean,
    disabled?: boolean
}

export type Module = {
    default?: {
        displayName?: string
    }
    render?: (props: any) => JSX.Element,
    displayName?: string
}

export type BDMutationRecord = TransformType<MutationRecord, NodeList, Array<ObservationNode>>;

export type ZLibrary = {
    DiscordModules: DiscordModules,
    ContextMenu: ContextMenu,
    DiscordClassModules: DiscordClassModules,
    WebpackModules: WebpackModules,
    Patcher: Patcher
}
export const ZLibrary: ZLibrary = (window as any).ZLibrary;
export default ZLibrary