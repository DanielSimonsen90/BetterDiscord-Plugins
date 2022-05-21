import ChannelManipulator from 'danho-discordium/DomManipulator/Channel';
import { UserPopoutManipulator } from 'danho-discordium/DomManipulator/UserPopout';
import ElementSelector from 'danho-discordium/ElementSelector';
import $, { DQuery } from '@dquery';
import { ChannelReturns, MessageReturns, UserPopoutReturns, RoleReturns } from './MutationReturns';
import ObservationConfig, { ObservationCallback } from './ObservationConfig';
import { Guild } from '@discord';

export type ChangeEvents = `${'guild' | 'channel' | 'category' | 'discord-content' | 'layer'}-change`;
export type LifeCycle<T extends string> = `${T}-${'create' | 'update' | 'render' | 'delete'}`;
export type MutationConfigOptions = ChangeEvents | LifeCycle<'message'> | 'user-popout'

function group(label: string, ...data: any[]) {
    console.groupCollapsed(`%c[${new Date().toLocaleTimeString()}] [${label}]%c`, "color: #3E70DD;", "color: #7898DA;", ...data);
}

export type ObservationReturns = {
    'guild-change': [Guild],
    'channel-change': ChannelReturns,
    'category-change': [],
    'discord-content-change': [],
    'layer-change': [{ className: string }],
    'user-popout': UserPopoutReturns,
} 
& { [key in LifeCycle<'message'>]: MessageReturns }

export type MutationConfig = {
    mutations?: {
        [Key in MutationConfigOptions]?: string | ObservationCallback<ObservationReturns[Key]>
    }
}

export class MutationManager {
    public static isDirectChild(parent: DQuery<HTMLElement>, child: Node) {
        return child && child instanceof HTMLElement && parent.hasDirectChild(child);
    }
    public static get writeSelector() {
        return new ElementSelector();
    }

    public static classIncludes(selector: string, element: keyof HTMLElementTagNameMap = "div"): string {
        return `${element}[class*="${selector}"]`;
    }
    public static includesChain(...selectors: Array<string | { type?: string, className?: string, label?: string }>): string {
        return selectors.map(selector => 
            typeof selector === 'string' ? 
                this.classIncludes(selector) : 
                this.classIncludes(
                    selector.className, 
                    selector.type ?? 'div' as any,
                ) + selector.label ? `[aria-label="${selector.label}"]` : ''
            ).join(" ");
    }
    
    constructor() {
        this.observations.set('layer-change', new ObservationConfig<ObservationReturns['layer-change']>('layer-change', 
        // () => $('#app-mount div[class*="app-"]').parent
        MutationManager.writeSelector.id("app-mount").className("app-", 'div').sibling.className('layerContainer', 'div')
        , function (record, callback) {
            if (record.type !== 'childList'
                || !record.addedNodes.length
                || !(record.addedNodes[0] instanceof HTMLElement)
                || !MutationManager.isDirectChild(this.element, record.addedNodes[0])
            ) return; 

            const props = $(record.addedNodes[0]).props as ObservationReturns['layer-change'][0];
            return callback(record, $(record.addedNodes[0]).fiber, props);
        }));
        this.observations.set('discord-content-change', new ObservationConfig<ObservationReturns['discord-content-change']>('discord-content', MutationManager.writeSelector
            .ariaLabel("Servers sidebar", 'nav')
            .sibling
            .className('base', 'div')
            .directChild('div').and.className('content')
        , function(record, callback) {
            if (!MutationManager.isDirectChild(this.element, record.target)) return;

            return callback(record, $(record.addedNodes[0] as HTMLElement).fiber);
        }));
        this.observations.set('guild-change', new ObservationConfig('guild-list', MutationManager.writeSelector
            .ariaLabel("Servers sidebar", 'nav')
            .ariaLabel('Servers', 'div')
        , function(record, callback) {
            if (!record.target 
                || !(record.target instanceof Element) 
                || !record.target.classList.contains('bd-selected') 
                || !record.target.classList.value.includes("listItem") 
                || record.type !== 'attributes' 
                || record.attributeName !== 'class'
            ) return;

            const [guild] = $(record.target as HTMLElement).prop<Guild>("guild");
            return callback(record, $(record.addedNodes[0] as HTMLElement).fiber, guild);
        }));
        this.observations.set('channel-change', new ObservationConfig<ObservationReturns['channel-change']>('channel-content', 
            () => $('main[class*="chatContent"]').parent,
            function(record, callback) {
                if (record.type !== 'childList'
                    || record.addedNodes.length <= 0
                    || !MutationManager.isDirectChild(this.element, record.addedNodes[0]) 
                    || (record.addedNodes[0] as HTMLElement).tagName !== 'MAIN'
                ) return;
                
                const [props] = $(record.target as HTMLElement).propsWith<ObservationReturns['channel-change'][0]>("channel");
                return callback(record, $(record.addedNodes[0] as HTMLElement).fiber, props, new ChannelManipulator(record, props));
            }, 'discord-content-change'
        ));
        // this.observations.set('category-change', new ObservationConfig('category-content', MutationManager.writeSelector
        //     .mutationManagerId('discord-content', 'div')
        //     .ariaLabelContains('(server)', 'nav')
        //     .ariaLabel("Channels", 'ul')
        //     .toString()
        // , function(record, callback) {
        //     if (!record.target
        //         || !(record.target instanceof Element)

        // }, 'discord-content-change'));
        this.observations.set('user-popout', new ObservationConfig<ObservationReturns['user-popout']>('user-popout', MutationManager.writeSelector
            .id("app-mount", 'div')
            // .directChild('div').and.className("layerContainer")
            .directChild('div').and.className("appDevToolsWrapper")
            .className("layerContainer", 'div')
            .id("popout", 'div')
        , function(record, callback) {
            if (record.type !== 'childList'
                || record.addedNodes.length <= 0
                || !(record.addedNodes[0] instanceof Element)
                || !MutationManager.isDirectChild(this.element, record.addedNodes[0])
                || !record.addedNodes[0].classList.value.includes('layer')
                || !record.addedNodes[0].id.includes("popout")
            ) return;

            console.log('user-popout')

            const [props] = $(record.addedNodes[0] as HTMLElement).propsWith<ObservationReturns['user-popout'][0]>("closePopout");
            if (!props) return false;
            return callback(record, $(record.addedNodes[0] as HTMLElement).fiber, props, new UserPopoutManipulator(record, props));
        }, 'layer-change'));

        (window as any).observations = () => console.log(this.observations);
    }

    protected observers: Map<MutationConfigOptions, MutationObserver> = new Map();
    protected observations: Map<MutationConfigOptions, ObservationConfig> = new Map()
    protected observerLocks: Map<MutationConfigOptions, NodeJS.Timeout> = new Map();
    protected observationCache: Map<any, any> = new Map();

    public on<
        Observation extends MutationConfigOptions | ObservationConfig<any> = MutationConfigOptions,
        Arguments extends Observation extends MutationConfigOptions ? ObservationReturns[Observation] : never = Observation extends MutationConfigOptions ? ObservationReturns[Observation] : never,
    >(key: Observation, callback: ObservationCallback<Arguments>) {
        group(`on(${key})`);
        const observation = (typeof key === 'string' ? this.observations.get(key as any) : key) as ObservationConfig<Arguments>;
        console.log(`Observation found`, observation);
        if (observation.ready) return this; // Already listening

        const that = this;
        function setObservation(element: HTMLElement, once = false) {
            const observer = new MutationObserver(records => { 
                let observation = that.observations.get(key as any);
                if (once && observation.hasRan) return observer.disconnect();

                if (!records.length) return;

                group(`on(${key})`);
                for (const record of records) {
                    observation.setupCallback(record, (...args) => {
                        var cached = that.observationCache.get(key)
                        const [_, ...noRecord] = args;
                        console.log(`Observation callback`, noRecord, cached);
                        if (cached && cached[0] == noRecord[0]) return false;

                        // @ts-ignore
                        const successful = callback(...args);
                        console.log({
                            successful,
                            callback,
                            args,
                            key
                        })
                        if (successful) observation.hasRan = true;
                        if (successful && once) {
                            observer.disconnect();
                            that.observations.delete(key as any);
                            that.observationCache.delete(key);
                        }

                        that.observations.set(key as MutationConfigOptions, observation);
                        that.observationCache.set(key, noRecord);
                        return successful;
                    })
                }

                console.groupEnd(); 
                console.groupEnd(); 
            });

            if (!element) {
                console.error(`Observation ${key} could not find selector ${observation.preferredSelector}`);
                return that;
            }

            $(element).attr('data-mutation-manager-id', observation.preferredSelector);
            console.log(`Element selected`, element);
            observer.observe(element, {
                attributes: true,
                subtree: true,
                childList: true,
            });

            observation.ready = true;
            that.observers.set(key as any, observer);

            console.log(`Observer construction complete`, [
                that.observers, 
                observer, key, observation, element, 
            ]);
            console.groupEnd();
            return that;
        }

        return !observation.dependency ? 
            setObservation($(observation.discordSelector).element) : 
            this.on(observation.dependency as any, record => {
                const [addedNode] = record.addedNodes;
                if (!addedNode || !(addedNode instanceof HTMLElement)) return false;
                
                const lookingFor = $(observation.discordSelector.toString()).element;
                if (!lookingFor) return false;

                const found = (
                    addedNode === lookingFor || 
                    addedNode.querySelector(observation.discordSelector.toString().split(' ').reverse().slice(1)[0]) === lookingFor
                );
                if (found) setObservation(addedNode, observation.dependency === 'once');
                observation.setupCallback(record, callback);
                
                this.observers.get(observation.dependency as any).disconnect();
                this.observations.delete(observation.dependency as any);
                return true;
            })
    }
    public off(key: MutationConfigOptions) {
        if (!this.observations[key]) {
            console.error(`Observation ${key} does not exist`);
            return this;
        }
        const observation = this.observations[key];

        if (!observation.ready) return this;

        const observer = this.observers.get(key);
        if (!observer) return this;

        observer.disconnect();
        observation.ready = false;
        this.observers.delete(key);
        return this;
    }
    public clear() {
        for (const observer of this.observers.values()) {
            observer.disconnect();
        }
        return this;
    }

    protected debounce(prop: MutationConfigOptions, callback: () => void, delay = 100) {
        clearTimeout(this.observerLocks[prop]);
        this.observerLocks[prop] = setTimeout(callback, delay);
    }
}
export default MutationManager;

export function initializeMutations(plugin: any, config: MutationConfig) {
    const mutationManager = new MutationManager();
    if (!config.mutations) return mutationManager;

    for (const key in config.mutations) {
        const callback = typeof config[key] === 'string' ? plugin[key] : config.mutations[key];
        mutationManager.on(key as MutationConfigOptions, callback.bind(plugin));
        console.log(`Observing ${key} bound to ${callback.name}`);
    }

    return mutationManager;
}