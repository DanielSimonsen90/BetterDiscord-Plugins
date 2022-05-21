import { DanhoPlugin, createPlugin, React, ReactDOM, $, ZLibrary } from 'danho-discordium';
import { PatchReturns } from 'danho-discordium/Patcher';
import { Role, Roles } from 'danho-discordium/Patcher/UserPopoutBody/roles';
import config from './config.json';

import { createBDD } from 'danho-discordium/Utils';
import { classNames } from '@discordium/modules';
import { DQuery } from '@dquery';
createBDD();

class DanhoDiscordV2<
    SettingsType extends Record<string, any>,
    DataType extends Record<"settings", SettingsType> = Record<"settings", SettingsType>
> extends DanhoPlugin<SettingsType, DataType> {
    async start() {
        super.start({
            after: {
                default: [
                    { selector: "UserProfileBadgeList", isModal: true },
                    { selector: "UserPopoutBody", isModal: true },
                    { selector: "ViewAsRoleSelector", isContextMenu: true }
                ]
            }
        });
    }

    patchViewAsRoleSelector({ args: [props], result }: PatchReturns["ViewAsRoleSelector"]) {
        this.logger.log('viewAsRoleSelector', props, result);
    }
    patchUserProfileBadgeList({ args: [props], result }: PatchReturns["UserProfileBadgeList"]) {
        console.log('userProfileBadgeList', result)
        if (!Array.isArray(result.props.children)) return this.logger.warn('UserProfileBadgeList children is not an array');

        const ref = $(s => s.getElementFromInstance(result));
        if (!ref.element) return;

        const classes = {
            clickable: ref.children(s => s.className("clickable", 'div'), true).classes,
            img: ref.children(s => s.className("profileBadge", 'img'), true).classes
        }

        const { TooltipContainer, Clickable } = this.BDFDB.LibraryComponents;

        const badge = (
            <TooltipContainer text="Crazy badge bro" spacing={24} key="test-badge">
                <Clickable aria-label='Test badge' className={`${classes.clickable} test-badge`} role="button" tabIndex={0}>
                    <img alt=' ' aria-hidden={true} src="https://media.discordapp.net/attachments/767713017274040350/768002085052088351/PinguDev.png" className={classes.img} />
                </Clickable>
            </TooltipContainer>
        );
        result.props.children.splice(3, 0, badge);
    }

    patchUserPopoutBody({ args: [props], result }: PatchReturns["UserPopoutBody"]) {
        const userPopoutBody = $(`.${result.props.className}`);
        if (!userPopoutBody.element) return;

        const [rolesListProps] = userPopoutBody.propsWith<Roles>("userRoles");
        const rolesList = $(`.${rolesListProps.className}`);
        if (!rolesList.element) return;

        rolesList.children('* > div[class*="role"]:not(div[class*="addButton"])').forEach((role, i) => {
            if (role.style?.borderColor) role.style.backgroundColor = role.style.borderColor?.replace('0.6', '0.09');

            role.on('click', e => role.children('div[class*="roleCircle"]', true).element.click());
        });
    }
}

export default createPlugin(config, api => new DanhoDiscordV2(api));