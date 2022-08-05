import initializePatches, { Patched } from 'danho-discordium/Patcher/Patcher';
import { Logger, Patcher } from 'discordium';
import Plugin from '../Plugin';

export * from './MenuItems';

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
                    // These modules don't exist anymore?
                    // { selector: 'GuildContextMenu', isContextMenu: true, override: true }
                    // { selector: 'MessageContextMenu', isContextMenu: true, override: true, callback: this.onMessageContextMenu, silent: true },
                    // { selector: 'GuildUserContextMenu', isContextMenu: true, override: true },
                ]
            }
        }).then(patches => this.patches = patches);
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

    private onMessageContextMenu({ args: [props], result: ret }) {
        console.log('onMessageContextMenu', { this: this, props, ret });
        this.events['message']?.(props, ret);
    }
}