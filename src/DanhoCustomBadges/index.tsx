const { React } = window.ZLibrary.DiscordModules;
import { PatchReturns } from "danho-discordium/Patcher";

import Badge from "./components/Badge";
import { SettingsPanel } from "./components/Settings";
import { Settings, SettingsUser } from "./Settings/types";

import config from './config.json';
import styles from './styles/index.scss';
import settings from './Settings/data.json';
import UserProfileBadgeList from "danho-discordium/Patcher/UserProfileBadgeList";
import { DQuery } from "@dquery";

export default window.BDD.PluginUtils.buildPlugin<Settings>({ ...config, styles, settings }, (Lib) => {
    const { $ } = Lib.Modules.DanhoModules;
    const Plugin = Lib.GetPlugin<Settings>();

    return class DanhoCustomBadge extends Plugin<Settings> {
        async start() {
            await super.start({
                after: {
                    default: {
                        UserProfileBadgeList: { isModal: true }, // TODO: Doesn't work for some reason
                        UserProfileModalHeader: { isModal: true },
                    },
                    UserPopoutInfo: {
                        UserPopoutInfo: { selector: ["UserPopoutInfo"], isModal: true },
                    }
                }
            });
        }

        SettingsPanel = (props: Settings) => {
            const [current, defaults, set] = this.settings.useStateWithDefaults();
            return <SettingsPanel {...props} {...{ ...current, defaults, set }} BDFDB={this.BDFDB} />
        }

        patchUserProfileBadgeList({ args: [props], result }: PatchReturns["UserProfileBadgeList"]) {
            this.logger.log("Hello from UserProfileBadgeList");
            if (!Array.isArray(result.props.children)) return this.logger.warn('UserProfileBadgeList children is not an array');

            const ref = $(s => s.getElementFromInstance(result, false), true);
            if (!ref || !ref.element || !ref.fiber) return /*this.logger.log("No ref element");*/

            this.modifyBadges(ref as DQuery<HTMLDivElement>, props.user.id);
        }
        patchUserProfileModalHeader({ args: [props], result }: PatchReturns["UserProfileModalHeader"]) {
            const ref = $(s => s.getElementFromInstance(result.props.children[1], false), true);
            if (!ref || !ref.element || !ref.fiber) return /*this.logger.log("No ref element");*/

            const [{ className }] = ref.propsWith<{ className: string }>("openPremiumSettings");
            const badgeList = $<true, HTMLDivElement>(`.${className}`, true);

            this.modifyBadges(badgeList, props.user.id, 24);
        }
        patchUserPopoutInfo({ args: [props], result }: PatchReturns["UserPopoutInfo"]) {
            const ref = $<true, HTMLDivElement>(s => s.getElementFromInstance(result.props.children[1], false) as HTMLDivElement, true);
            if (!ref || !ref.element || !ref.fiber) return /*this.logger.log("No ref element");*/

            this.modifyBadges(ref, props.user.id);
        }

        modifyBadges(badgeList: DQuery<HTMLDivElement>, userId: string, size = 22) {
            const userSettings = this.getUserSettings(userId);
            if (!userSettings) return /*this.logger.log("User has no settings");*/

            const props = badgeList.props as UserProfileBadgeList;

            for (const { index, tooltip, ...badgeProps } of userSettings.badges) {
                const badge = (() => {
                    try {
                        return <Badge key={index} BDFDB={this.BDFDB} tooltipText={tooltip} {...badgeProps} size={size} />
                    } catch (err) {
                        this.logger.error(err);
                        return null;
                    }
                })()

                if (badge) {
                    const badgeAtPos = badgeList.children()[index];
                    if (badgeAtPos.classes === "bdd-wrapper" && !badgeAtPos.children().length) {
                        badgeAtPos.unmount();
                        continue;
                    }
                    if (badgeAtPos.firstChild.classes.includes("danho-badge")
                        && badgeAtPos.firstChild.attr("data-id") === badgeProps.id)
                        continue;

                    badgeAtPos.insertComponent("beforebegin", badge)
                }
            }

            this.storePremiumData(userId, props as UserProfileBadgeList);
        }

        storePremiumData(userId: string, badgeListProps: UserProfileBadgeList) {
            const userSettings = this.getUserSettings(userId);

            const isPremiumBadge = (text: string) => text?.includes("Subscriber since") || text?.includes("Server boosting since");
            const premiumBadges = badgeListProps.children.filter(child => isPremiumBadge(child.props.text)).map(child => child.props.text);
            if (!premiumBadges.length) {
                if (!userSettings.premiumSince && !userSettings.boosterSince) return;

                userSettings.premiumSince = null;
                userSettings.boosterSince = null;
                return this.saveUserSettings(userId, userSettings);
            }

            const changedProps = premiumBadges.filter(text => {
                const prop = text.includes("Subscriber since") ? "premiumSince" : "boosterSince";
                const [yearText, dateText, monthName] = text.replace(',', '').split(' ').reverse();
                const [year, day] = [yearText, dateText].map(text => parseInt(text));
                const month = (() => {
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    return months.indexOf(monthName);
                })();

                const date = new Date(year, month, day).toString();
                if (userSettings[prop] === date.toString()) return false;

                userSettings[prop] = date.toString();
                return true;
            }).length > 0;

            if (changedProps) this.saveUserSettings(userId, userSettings);
        }

        getUserSettings(userId: string): SettingsUser {
            return this.settings.get().users[userId];
        }
        saveUserSettings(userId: string, data: SettingsUser) {
            const settings = this.settings.get();
            const { users } = settings;
            this.logger.log(`Saving user settings for ${userId}`, data);
            this.data.save("settings", { ...settings, users: { ...users, [userId]: data } });
        }
    } as any;
});