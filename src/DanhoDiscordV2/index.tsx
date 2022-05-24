import { DanhoPlugin, createPlugin, $ } from 'danho-discordium';
import { PatchReturns } from 'danho-discordium/Patcher';
import { Roles } from 'danho-discordium/Patcher/UserPopoutBody/roles';

import { createBDD } from 'danho-discordium/Utils';
createBDD();

class DanhoDiscordV2<
    SettingsType extends Record<string, any>,
    DataType extends Record<"settings", SettingsType> = Record<"settings", SettingsType>
    > extends DanhoPlugin<SettingsType, DataType> {
    async start() {
        super.start({
            after: {
                default: [
                    { selector: "UserPopoutBody", isModal: true },
                    { selector: "ViewAsRoleSelector", isContextMenu: true }
                ]
            }
        });
    }

    patchViewAsRoleSelector({ args: [props], result }: PatchReturns["ViewAsRoleSelector"]) {
        this.logger.log('viewAsRoleSelector', props, result);
    }


    patchUserPopoutBody({ args: [props], result }: PatchReturns["UserPopoutBody"]) {
        const userPopoutBody = $(`.${result.props.className}`);
        if (!userPopoutBody.element) return;

        const [rolesListProps] = userPopoutBody.propsWith<Roles>("userRoles");
        if (!rolesListProps) return;

        const rolesList = $(`.${rolesListProps.className}`);
        if (!rolesList.element) return;

        rolesList.children('* > div[class*="role"]:not(div[class*="addButton"])').forEach((role, i) => {
            if (role.style?.borderColor) role.style.backgroundColor = role.style.borderColor?.replace('0.6', '0.09');

            role.on('click', e => role.children('div[class*="roleCircle"]', true).element.click());
        });
    }
}

import config from './config.json';
export default createPlugin(config, api => new DanhoDiscordV2(api));