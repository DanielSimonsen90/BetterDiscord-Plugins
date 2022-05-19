import { Guild } from 'danho-bd/discord';
import ChannelManipulator from 'danho-discordium/DomManipulator/Channel';
import { UserPopoutManipulator } from 'danho-discordium/DomManipulator/UserPopout';
import ElementSelector from 'danho-discordium/ElementSelector';
import $, { DQuery } from '../dquery';
import { ChannelReturns, MessageReturns, UserPopoutReturns } from './MutationReturns';
import ObservationConfig, { ObservationCallback } from './ObservationConfig';

export type ChangeEvents = `${'guild' | 'channel' | 'category' | 'discord-content'}-change`;
export type LifeCycle<T extends string> = `${T}-${'create' | 'update' | 'render' | 'delete'}`;
export type MutationConfigOptions = ChangeEvents | LifeCycle<'message'> | LifeCycle<'user-popout'>

function group(label: string, ...data: any[]) {
    console.groupCollapsed(`%c[${new Date().toLocaleTimeString()}] [${label}]%c`, "color: #3E70DD;", "color: #7898DA;", ...data);
}

export type ObservationReturns = {
    'guild-change': [Guild],
    'channel-change': ChannelReturns,
    'category-change': [],
    'discord-content-change': [],
} 
& { [key in LifeCycle<'message'>]: MessageReturns }
& { [key in LifeCycle<'user-popout'>]: UserPopoutReturns }

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
        this.observations.set('discord-content-change', new ObservationConfig<ObservationReturns['discord-content-change']>('discord-content', MutationManager.writeSelector
            .ariaLabel("Servers sidebar", 'nav')
            .sibling
            .className('base', 'div')
            .directChild('div')
            .className('content')
            .toString()
        , function(record, callback) {
            if (!MutationManager.isDirectChild(this.element, record.target)) return;

            return callback(record);
        }));
        this.observations.set('guild-change', new ObservationConfig('guild-list', MutationManager.writeSelector
            .ariaLabel("Servers sidebar", 'nav')
            .ariaLabel('Servers', 'div').toString()
        , function(record, callback) {
            if (!record.target 
                || !(record.target instanceof Element) 
                || !record.target.classList.contains('bd-selected') 
                || !record.target.classList.value.includes("listItem") 
                || record.type !== 'attributes' 
                || record.attributeName !== 'class'
            ) return;

            const [guild] = $(record.target as HTMLElement).prop<Guild>("guild");
            return callback(record, guild);
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
                return callback(record, props, new ChannelManipulator(record, props.channel));
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
        this.observations.set('user-popout-render', new ObservationConfig<ObservationReturns['user-popout-create']>('user-popout-create', MutationManager.writeSelector
            .id("app-mount", 'div')
            .directChild('div').and.className("layerContainer")
        , function(record, callback) {
            if (record.type !== 'childList'
                || record.addedNodes.length <= 0
                || !(record.addedNodes[0] instanceof Element)
                || !MutationManager.isDirectChild(this.element, record.addedNodes[0])
                || !record.addedNodes[0].classList.value.includes('layer')
                || !record.addedNodes[0].id.includes("popout")
            ) return;

            const [props] = $(record.addedNodes[0] as HTMLElement).propsWith<ObservationReturns['user-popout-create'][0]>("closePopout");
            if (!props) return false;
            return callback(record, props, new UserPopoutManipulator(record, props));
        }));

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

        const observer = new MutationObserver(records => { group(`on(${key}, observer records)`); records.forEach(async (record, i) => {
            console.log(`records[${i}]`, { record, observation });
            // if (!MutationManager.isDirectChild(observation.element, record.target)) {
            //     console.log(`Not direct child`, record.target, observation.element);
            //     return;
            // }
            
            const shouldRun = await (async () => {
                group(`on(${key}), observer records[${i}], shouldRun`);
                // // Observation should only run once
                // if (observation.dependency && observation.dependency === 'once') {
                //     return !observation.hasRan;
                // }
                // Observation has dependency
                if (observation.dependency) {
                    console.log(`Observation has dependency`, observation.dependency);
                    const dependency = this.observations.get(observation.dependency as MutationConfigOptions);
                    
                    try {
                        const dependencyElement = dependency.element;
                        console.log(`Element status`, dependencyElement ? 'exists - returning true' : 'does not exist - throwing error');
                        if (!dependencyElement) throw new Error('Dependency element not in DOM');
                        console.groupEnd();
                        return true;
                    } catch (err) {
                        console.log(`Unable to find dependency element - awaiting promise`, err);
                        return new Promise<boolean>((resolve, reject) => {
                            try {
                                console.log(`Awaiting promise`);
                                // Wait for dependency element to be in DOM
                                this.on(observation.dependency as MutationConfigOptions, record => {
                                    // If record type is childList and addedNodes isn't empty and contains observation element, resolve
                                    if (record.type === 'childList' 
                                        && record.addedNodes.length > 0 
                                        && [...record.addedNodes.values()].some(node => 
                                            node instanceof HTMLElement 
                                            && $(node).children(observation.discordSelector)
                                    )) {
                                        console.log(`Dependency element found in promise - resolving true`);
                                        resolve(true);
                                        return false; // Not sure if true or false
                                    }
                                })
                            } catch (err) {
                                console.log(`Unable to find dependency element - rejecting`, err);
                                console.groupEnd();
                                reject(err);
                            }
                        })
                    }
                }

                // Observation should run everytime
                console.log(`Observation has no dependency - return true`);
                console.groupEnd();
                return true;
            })();
            if (!shouldRun) return;

            observation.setupCallback(record, (...args) => {
                var cached = this.observationCache.get(key)
                const [_, ...noRecord] = args;

                console.log(`Observation callback`, noRecord, cached);
                if (cached && cached[0] == noRecord[0]) {
                    console.log(`Doublicate observation`);
                    return false;
                }

                const successful = callback(...args);
                if (successful) observation.hasRan = true;
                this.observations.set(key as MutationConfigOptions, observation);
                this.observationCache.set(key, noRecord);
                return successful;
            });
        }); console.groupEnd(); });

        console.log(`Observer constructed`, observer);

        const selected = $(observation.discordSelector);
        if (!selected.element) {
            console.error(`Observation ${key} could not find selector ${observation.preferredSelector}`);
            return this;
        }
        selected.attr('data-mutation-manager-id', observation.preferredSelector);

        console.log(`Element selected`, selected);

        observer.observe(selected.element, {
            attributes: true,
            subtree: true,
            childList: true,
        });

        observation.ready = true;
        this.observers.set(key as any, observer);

        console.log(`Observer construction complete`, [
            this.observers, 
            observer, key, observation, selected, 
        ]);
        console.groupEnd();
        return this;
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