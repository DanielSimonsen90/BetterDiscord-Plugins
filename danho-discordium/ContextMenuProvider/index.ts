import ZLibrary, { Module } from 'danho-bd/libraries/ZLibrary';
import $ from 'danho-discordium/dquery';
import initializePatches, { Patched } from 'danho-discordium/Patcher';
import { Logger, Patcher } from 'discordium/api';
import Plugin from '../Plugin';

export * from './MenuItems';

type PatchedMessageProps = {

}
type WeakFiber = {
    props: {
        children: any;
    }
}

type PatchedProps = {
    message: {},
    guild: {},
    channel: {},
    user: {},
    groupDm: {},
}
type PatchCallback<E extends keyof PatchedProps> = (props: PatchedProps[E], ret: WeakFiber) => void;

export default class ContextMenuProvider {
    public static getInstance(plugin: Plugin<any>) {
        if (!ContextMenuProvider.instance) {
            ContextMenuProvider.instance = new ContextMenuProvider(plugin);
        }
        return ContextMenuProvider.instance;
    }
    private static instance: ContextMenuProvider;
    private constructor(public plugin: Plugin<any>) {
        initializePatches(this, {
            after: {
                default: [
                    // { selector: 'GuildContextMenu', isContextMenu: true, override: true }
                    { selector: 'MessageContextMenu', isContextMenu: true, override: true, callback: this.onMessageContextMenu, silent: true },
                    // { selector: 'GuildUserContextMenu', isContextMenu: true, override: true },
                ]
            }
        })
    }

    public get logger(): Logger {
        return this.plugin.logger;
    }
    public get patcher(): Patcher {
        return this.plugin.patcher;
    }
    public patches: Array<Patched>

    private events: Record<keyof PatchedProps, PatchCallback<any>> = {} as any
    public on<Event extends keyof PatchedProps>(event: Event, callback: PatchCallback<Event>) {
        this.events[event] = callback;
    }
    public off<Event extends keyof PatchedProps>(event: Event) {
        this.events[event] = null;
    }

    private onMessageContextMenu(thisObject: any, props: PatchedProps['message'], ret: WeakFiber) {
        this.events['message'](props, ret);
    }
}