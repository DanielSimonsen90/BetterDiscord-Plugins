import { createPlugin, DanhoPlugin, React, $ } from "danho-discordium";
import { PatchReturns } from "danho-discordium/Patcher";
import Badge from "./components/Badge";
import { BadgeData, Settings } from "./Settings/types";

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
        const BadgeList = this.patches.find(p => p.module.default.displayName === 'UserProfileBadgeList')?.module.default as React.FunctionComponent;

        return <SettingsPanel {...props} BadgeList={BadgeList} BDFDB={this.BDFDB} />
    }

    patchUserProfileBadgeList({ args: [props], result }: PatchReturns["UserProfileBadgeList"]) {
        // return console.log(props, result);
        if (!Array.isArray(result.props.children)) return this.logger.warn('UserProfileBadgeList children is not an array');

        const ref = $(s => s.getElementFromInstance(result));
        if (!ref.element) return console.log("No ref element");

        const userSettings = this.getUserSettings(props.user.id);
        if (!userSettings) return;

        console.log(userSettings)

        for (const { index, tooltip, ...props } of userSettings) {
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
    }

    getUserSettings(userId: string): Array<BadgeData> {
        return this.settings.get().users[userId];
    }
}

import config from './config.json';
import styles from './styles.scss';
import settings from './Settings/data.json';
import { SettingsProps } from "@discordium/api";
import { SettingsPanel } from "./components/Settings";
export default createPlugin<Settings>({ ...config, styles, settings }, api => new DanhoCustomBadge(api));