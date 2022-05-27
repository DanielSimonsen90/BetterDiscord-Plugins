import { SettingsProps } from "@discordium/api";
import { User } from "@discord";

import { createPlugin, DanhoPlugin, React, $ } from "danho-discordium";
import { PatchReturns } from "danho-discordium/Patcher";

import Badge from "./components/Badge";
import { SettingsPanel } from "./components/Settings";
import { BadgeData, Settings, SettingsUser } from "./Settings/types";

class DanhoCustomBadge extends DanhoPlugin<Settings> {
    async start() {
        await super.start({
            after: {
                default: [
                    { selector: "UserProfileBadgeList", isModal: true },
                ]
            }
        })
    }

    settingsPanel = (props: SettingsProps<Settings>) => {
        return <SettingsPanel {...props} BDFDB={this.BDFDB} />
    }

    patchUserProfileBadgeList({ args: [props], result }: PatchReturns["UserProfileBadgeList"]) {
        if (!Array.isArray(result.props.children)) return this.logger.warn('UserProfileBadgeList children is not an array');

        const ref = $(s => s.getElementFromInstance(result, true), false);
        if (!ref.length) return console.log("No ref element");

        const userSettings = this.getUserSettings(props.user.id);
        if (!userSettings) return;

        for (const { index, tooltip, ...props } of userSettings.badges) {
            const badge = (() => {
                try {
                    return <Badge BDFDB={this.BDFDB} tooltipText={tooltip} {...props} />
                } catch (err) {
                    this.logger.error(err);
                    return null;
                }
            })()

            if (badge) result.props.children.splice(index, 0, badge);
        }

        this.storePremiumData(props.user.id, result);
    }

    storePremiumData(userId: string, badgeList: PatchReturns["UserProfileBadgeList"]["result"]) {
        const userSettings = this.getUserSettings(userId);

        const isPremiumBadge = (text: string) => text?.includes("Subscriber since") || text?.includes("Server boosting since");
        const premiumBadges = badgeList.props.children.filter(child => isPremiumBadge(child.props.text)).map(child => child.props.text);
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
}

import config from './config.json';
import styles from './styles/index.scss';
import settings from './Settings/data.json';
export default createPlugin<Settings>({ ...config, styles, settings }, api => new DanhoCustomBadge(api));

/*

Redo UserSettings model: {
    [userId]: {
        premiumSince: Date,
        boosterSince: Date,
        badges: [...BadgeData],
    }
}

*/