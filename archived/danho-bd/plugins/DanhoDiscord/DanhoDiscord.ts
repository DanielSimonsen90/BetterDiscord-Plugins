// @ts-nocheck

import {} from 'danholibraryjs';
import { Setting } from "danho-bd/base";
import { BDFDBPluginParams } from "@BDFDB";
import DanhoPlugin from "../base/DanhoPlugin";
import IConfigData from "../base/IConfigData";
import { AnalyticsContext } from "../base/ProcessEvent";
import * as DanhoProcessEvent from "../base/DanhoProcessEvent";

export class DanhoDiscordBuilder {
    static config: IConfigData = {
        info: {
            name: 'DanhoDiscord',
            author: "Danho",
            version: "1.3",
            description: "Slight modifications to Discord's sentences & few layout edits"
        },
        changeLog: {
            improved: {
                "Rewritten to TypeScript": "The plugin is now written in TypeScript idk"
            }
        }
    }
    static build(params: BDFDBPluginParams) {
        return DanhoDiscord(params, this.config);
    }
}

type DanhoDiscordSettings = {
    renameSettings: Record<
        'botTag' | 'serverTag' | 'systemTag' | 'publicGuildPolicyAccept' | 'statusDND' | 'statusIDLE' | 'statusONLINE',
        string
    > & Record<'enabled', boolean>,
    fakeServers: Record<`showFake${'Verified' | 'Partnered'}`, boolean>,
    developerSettings: Record<'showMessagesInConsole' | 'clearConsoleOnLoad', boolean>,
}

export default function DanhoDiscord([Plugin, BDFDB, ZLibrary]: BDFDBPluginParams, config: IConfigData): ReturnType<typeof DanhoPlugin> {
    const defaultSettings: DanhoDiscordSettings = {
        renameSettings: {} as DanhoDiscordSettings['renameSettings'],
        fakeServers: {} as DanhoDiscordSettings['fakeServers'],
        developerSettings: {} as DanhoDiscordSettings['developerSettings'],
    }
    let { renameSettings, fakeServers, developerSettings } = defaultSettings;

    return class DanhoDiscord extends DanhoPlugin([Plugin, BDFDB, ZLibrary], config)<DanhoDiscordSettings> {
        messages = BDFDB.LibraryModules.LanguageStore.Messages;

        onStart() {
            super.onStart();

            this.messages["BOT_TAG_BOT"] = renameSettings.botTag;
            this.messages["BOT_TAG_SERVER"] = renameSettings.serverTag;
            this.messages["SYSTEM_DM_TAG_SYSTEM"] = renameSettings.systemTag;

            this.messages["PUBLIC_GUILD_POLICY_ACCEPT"] = renameSettings.publicGuildPolicyAccept;

            this.messages["STATUS_DND"] = renameSettings.statusDND;
            this.messages["STATUS_IDLE"] = renameSettings.statusIDLE;
            this.messages["STATUS_ONLINE"] = renameSettings.statusONLINE;

            if (developerSettings?.showMessagesInConsole) console.log(this.messages);
            if (developerSettings && !developerSettings.showMessagesInConsole) return;
            console.clear();
            this.logger.log("Cleared console.");
        }
        onLoad() {
            super.onLoad();
            this.defaults = {
                renameSettings: {
                    enabled: new Setting(true, "Rename Discord's default strings"),
                    botTag: new Setting('Bot', `The BOT tag string`),
                    serverTag: new Setting('Server', `The SERVER tag string`),
                    systemTag: new Setting('Discord', `The SYSTEM tag string`),
                    publicGuildPolicyAccept: new Setting(`I havent read the terms but get out of my way.`, `Public Guild Policy Accept`),
                    statusDND: new Setting('Do not D-Sturb', `Do not Disturb`),
                    statusIDLE: new Setting('AFK', `Idle`),
                    statusONLINE: new Setting('Available', `Online`),
                },
                fakeServers: {
                    showFakeVerified: new Setting(true, `Show fake verified servers`),
                    showFakePartnered: new Setting(true, `Show fake partnered servers`),
                },
                developerSettings: {
                    showMessagesInConsole: new Setting(false, `Show Discord's default messages in console`),
                    clearConsoleOnLoad: new Setting(true, `Clear the console when loading the plugin`)
                }
            }

            this.patchedModules = {
                after: {
                    AnalyticsContext: "render",
                }
            }

            this.loadSettings();
        }

        getSettingsPanel(collapseStates = {}) {
            return this.createSettingsPanel(collapseStates, [   
                this.createCollapseContainer("renameSettings", renameSettings, (key, index) => ({
                    type: index < 2 ? 'Switch' : 'TextInput',
                    basis: index < 2 ? null : "65%",
                })),
                this.createCollapseContainer("fakeServers", fakeServers, () => ({
                    type: "Switch"
                })),
                this.createCollapseContainer("developerSettings", developerSettings, () => ({
                    type: "Switch"
                }))
            ])
        }
        loadSettings(): DanhoDiscordSettings {
            [renameSettings, fakeServers, developerSettings] = ["renameSettings", "fakeServers", "developerSettings"]
                .reduce((result, search) => [...result, BDFDB.DataUtils.get(this as any, search)], 
                    new Array<Record<string, any>>()
            );
            return { renameSettings, fakeServers, developerSettings }
        }

        forceUpdateAll() {
            this.loadSettings();
            super.forceUpdateAll();
        }

        plsStop = false;
        onRoleClick(element: HTMLDivElement, e: MouseEvent) {
            try {
                //Right Click
                if (e.button == 2) { return }

                const child = element.children[0] as HTMLDivElement;
                child?.click?.();
            } catch (err) {
                this.logger.error(err);                    
            }
        }

        processRolesList() {
            const roleList = document.querySelector("[class*='rolesList']");
            if (!roleList) return;

            const rolesToReplace = document.querySelector("[class*='rolesList']");
            const roles = roleList.querySelectorAll<HTMLElement>(`.${ZLibrary.DiscordClassModules.PopoutRoles.role}`);
            if (!roles || !roles.length) {
                return this.logger.error("Could not find roles", {
                    roleList,
                    PopoutRoles: ZLibrary.DiscordClassModules.PopoutRoles,
                    roleClass: ZLibrary.DiscordClassModules.PopoutRoles.role,
                });
            }

            for (let i = 0; i < roles.length; i++) {
                const role = roles[i];
                const instance = this.getReactInstance<DanhoProcessEvent.RoleInstance["props"]>(role);

                role.style.backgroundColor = role.style.borderColor?.replace('0.6', '0.09');

                if (instance) {
                    if (instance.memoizedProps.canRemove) {
                        role.style.cursor = "pointer";

                        role.addEventListener("click", this.onRoleClick.bind(this, role));
                    }
                }
            }

            roleList.replaceChild(rolesToReplace, roleList);
        }   

        processAnalyticsContext(e: AnalyticsContext) {
            this.processRolesList();

            return e.returnvalue;
        }
    } as any;
}