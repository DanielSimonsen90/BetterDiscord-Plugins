import { Arrayable, BetterOmit } from "danholibraryjs";

import IAuthor from "./IAuthor";
import IConfigData, { ConfigInfo } from "./IConfigData";
import LoggerUtil from "./LoggerUtil";

import SettingsSaveItem from "@BDFDB/LibraryComponents/SettingsSaveItem";
import { BDFDBPluginParams, PatchedModules } from '@BDFDB';
import { ComponentInstance, ComponentFiber, Component } from '@lib/React';

import { Setting } from "danho-bd/base";
import * as ProcessEvents from './ProcessEvent';
import React, { Attributes, ComponentClass, ReactHTML } from "react";

type SettingsSaveItemProps = BetterOmit<SettingsSaveItem['defaultProps'], 'plugin' | 'label' | 'value' | 'keys'>;

/**
 * @name DanhoPlugin
 * @author Danho
 * @authorId 245572699894710272
 */

type DefaultSettings<Settings> = {
    [S in keyof Settings]: {
        [V in keyof Settings[S]]: Setting<Settings[S][V]>
    }
}

export function DanhoPlugin([Plugin, BDFDB, ZLibrary]: BDFDBPluginParams, config: IConfigData) {
    return class DanhoPlugin<Settings = Record<string, any>> extends Plugin implements IAuthor, ConfigInfo, ProcessEvents.ProcessMethods {
        //#region IAuthor
        public getName(): string { return this.name; }
        public getDescription(): string { return this.description; }
        public getAuthor(): string { return this.author; }
        public getVersion(): string { return this.version }
        //#endregion

        //#region Config
        static config: IConfigData = config;
        public name: string = config.info.name ?? "Danho's Plugin";
        public version: string = config.info.version ?? "1.0.0";
        public description: string = config.info.description ?? "A cool plugin!";
        public author: string = config.info.author ?? "Danho#2105";
        //#endregion

        public logger = new LoggerUtil(this.name, `#fab54b`, `ff5e00`);
        public defaults: DefaultSettings<Settings>;
        public patchedModules: PatchedModules;
        public css: string;
        public SettingsUpdated: boolean;

        //#region Current Properties
        public get me() {
            return BDFDB.UserUtils.me;
        }

        // TODO: Fix because it returns undefined for some reason
        public get currentGuild() {
            const node = document.querySelector(`.bd-guild.bd-selected div[data-list-item-id^="guildsnav"]`);
            if (!node) return null;
            const split = node.getAttribute("data-list-item-id").split("_");
            const guildId = split[split.length - 1];
            return ZLibrary.DiscordModules.GuildStore.getGuild(guildId);
        }
        public get currentChannel() {
            const currentChannelId = ZLibrary.DiscordModules.SelectedChannelStore.getChannelId();
            return currentChannelId ? ZLibrary.DiscordModules.ChannelStore.getChannel(currentChannelId) : null;
        }
        //#endregion

        //#region LifeCycle Events
	    public onStart() { this.forceUpdateAll(); }
        public onLoad() {
            this.DOMPatches = {
                childList: { addedNodes: [], removedNodes: [], patched: false },
                attributes: { attributeName: [], oldValue: [], patched: false },
            }

            /*
            this.defaults = {} as Settings;
            this.patchedModules = {
                before: {},
                after: {}
            }
            this.css = ''
            */
        }
        public onStop() { this.forceUpdateAll(); }

        public onError(message: string, err: Error) { this.logger.error(message, err); }
        //#endregion

        public forceUpdateAll() {
            BDFDB.PatchUtils.forceAllUpdates(this as any);
            BDFDB.MessageUtils.rerenderAll();
        }

        //#region Settings
        public createSettingsPanel(collapseStates: {}, children: Array<ReturnType<typeof this.createCollapseContainer>>) {
            return BDFDB.PluginUtils.createSettingsPanel(this as any, { collapseStates, children });
        }
        public createCollapseContainer(setting: keyof Settings, settingObj: any, props: (key: string, index: number, keys: Array<string>) => SettingsSaveItemProps) {
            return this.createElement(BDFDB.LibraryComponents.CollapseContainer, {
                title: `${(setting as string).substring(0, 1).toUpperCase() + (setting as string).substring(1)} Settings`,
                collapseStates: {},
                children: Object.keys(settingObj).map((key, index, keys) => (
                    this.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
                        key: index,
                        plugin: this,
                        keys: [setting as string, key],
                        label: this.defaults[setting][key]?.description || "No description?",
                        value: settingObj[key],
                        ...props(key, index, keys)
                    })
                ))
            });
        }

        public onSettingsClosed() {
            if (!this.SettingsUpdated) return;

            delete this.SettingsUpdated;
            this.forceUpdateAll();
        }
        //#endregion

        //#region React
        public createElement<
            // Element extends (Component<any> | keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap) = Component,
            // Props = Element extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[Element] : 
            //         Element extends keyof SVGElementTagNameMap ? SVGElementTagNameMap[Element] : 
            //         Element extends Component<infer P> ? P : never
            Element extends ComponentClass<any> | keyof ReactHTML = ComponentClass<any>,
            Props = Element extends ComponentClass<infer P> ? Attributes & P | null : 
                    Element extends keyof ReactHTML ? ReactHTML[Element] | null : 
                    never
        >(component: Element, props?: Props) {
            return BDFDB.ReactUtils.createElement(component as any, props);
        }
        public getReactInstance<Props = {}, State = null>(node: Node): ComponentFiber<Props, State> | null {
            return BDFDB.ReactUtils.getInstance(node);
        }
        public render<P>(component: React.ReactElement<P>, target: ReactDOM.Container) {
            return BDFDB.ReactUtils.render(component, target);
        }

        public createHTMLElement<
            Element extends (Component<any> | keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap) = Component,
            Props = Element extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[Element] : 
                    Element extends keyof SVGElementTagNameMap ? SVGElementTagNameMap[Element] : 
                    Element extends Component<infer P> ? P : never
        >(component: Element, props: Props, children: Arrayable<Element> = null): HTMLElement {
            const parentTag: string = typeof component === "string" ? component : component['type'];
            const element = document.createElement(parentTag);

            if ('children' in props || children) {
                const childrenResolvable = props['children'] || children;
                children = Array.isArray(childrenResolvable) ? childrenResolvable : [childrenResolvable];
                const appendChild = (child: Element) => element.appendChild(this.createHTMLElement(child, child['props']));

                for (const child of children) {
                    appendChild(child);
                }
            }

            Object.entries(props).forEach(([key, value]) => {
                switch (key) {
                    case 'children': return;
                    case 'className': case 'class': return element.classList.add(value.toString()); 
                    case 'dataset': case 'data': return Object.entries(value).forEach(([key, value]) => element.dataset[key] = value.toString());
                    case 'text': return element.textContent = value.toString();
                    default: return element.setAttribute(key, value.toString());
                }
            });

            return element;
        }
        public renderNode(node: HTMLElement, target: HTMLElement, options = {
            /**@default false */ before: false,
            /**@default true */ after: true
        }) {
            if (options.before) target.insertBefore(node, target.firstChild);
            else if (options.after) target.appendChild(node);
        }
        //#endregion

        //#region processWebpackModules
        public processShakeable(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processPrivateChannel(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processAnalyticsContext(e: ProcessEvents.AnalyticsContext) {
            return e.returnvalue
        }
        public processPeopleListItem(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processTabBar(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processFriendRow(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processDiscodTag(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processGuilds(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processGuildItem(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processPeopleList(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processPeopleListSectionedLazy(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processNameTag(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processChannelCategoryItem(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processChannelTextAreaContainer(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processChannelEditorContainer(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processMemberListItem(e: ProcessEvents.MemberListItem) {
            return e.returnvalue
        }
        public processChannels(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processChanneltextAreaForm(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processMessage(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processMessageHeader(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processMessageUsername(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processMessageTimestamp(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processLazyImageZoomable(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processLazyImage(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processEmbed(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processSystemMessage(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processMessageToolbar(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processUserPopoutContainer(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processUserBanner(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue
        }
        public processUserPopoutInfo(e: ProcessEvents.UserPopoutInfo) {
            return e.returnvalue;
        }
        public processUserProfileModal(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue;
        }
        public processUserProfileModalHeader(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue;
        }
        public processSettingsView(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue;
        }
        public processUseCopyIdItem(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue;
        }
        public processStandardSidebarView(e: ProcessEvents.ProcessEvent) {
            return e.returnvalue;
        }
        public processUserProfileBadgeList(e: ProcessEvents.UserProfileBadgeList) {
            return e.returnvalue;
        }
        //#endregion
    
        //#region Utilities
        public static findClassModuleContainingClass(className: string) {
            const DiscordClassModules = Object.assign({}, ZLibrary.DiscordClassModules, BDFDB.DiscordClassModules);
            
            return Object.keys(DiscordClassModules).map(key => {
                const property = DiscordClassModules[key];
                if (!property) return null;

                const filtered = Object.keys(property).map(item => {
                    const value = property[item];
                    return value.toLowerCase().includes(className.toLowerCase()) && [item, value];
                }).filter(v => v);
                    
                if (!filtered.length) return null;

                return [key, filtered.reduce((result, [item, value]) => {
                    result[item] = value;
                    return result;
                }, {} as any)];
            }).filter(v => v).reduce((result, [key, value]) => {
                result[key] = value;
                return result;
            }, {} as any);
        }
        public static findModuleByIncludes(displayName: string, returnDisplayNamesOnly = false) {
            const modules = ZLibrary.WebpackModules.findAll(match => match?.default?.displayName?.toLowerCase().includes(displayName.toLowerCase()));
            if (!returnDisplayNamesOnly) return modules;
            return modules.map(module => module.default.displayName).sort();
        }
        public static findNodeByIncludingClassName<NodeType = Element>(className: string, node = document.body): NodeType | null {
            return node.querySelector(`[class*="${className}"]`) as any;
        }
        // create a function that checks if a node has the class we are looking for and returns it if it does,
        // otherwise it checks all of its children for the class, and so on until it finds it or runs out of children
        // and save the path of property names to get to the class in a variable called path
        public static getDescendantFromClassName<ComponentNode extends { props: { children: any } }>(node: ComponentNode, className: string, path: Array<string> = []): [ComponentInstance<any> | null, string]  {
            if (!node?.props) return [null, path.join(".")];
            if (node.props['className']?.split(' ').includes(className)) {
                return [node as any, path.join('.')];
            }
            else if (!node.props.children) return [null, path.join('.')];

            if (Array.isArray(node.props.children)) {
                for (let i = 0; i < node.props.children.length; i++) {
                    const [child, childPath] = this.getDescendantFromClassName(node.props.children[i], className, [...path, `props.children[${i}]`]);
                    if (child) return [child, childPath];
                }
            }
            else {
                const [child, childPath] = this.getDescendantFromClassName(node.props.children, className, [...path, 'props.children']);
                if (child) return [child, childPath];
            }
            return [null, path.join('.')];
        }
        //#endregion
    }
}

export default DanhoPlugin;

(window as any).BDD = DanhoPlugin;