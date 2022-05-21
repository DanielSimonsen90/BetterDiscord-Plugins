import { BDFDB, DanhoPlugin, createPlugin, React, $, ZLibrary } from 'danho-discordium';
import { MutationReturns, ObservationReturns } from 'danho-discordium/MutationManager';
import { PatchReturns } from 'danho-discordium/Patcher';
import { Role, Roles } from 'danho-discordium/Patcher/UserPopoutBody/roles';
import config from './config.json';

import { createBDD } from 'danho-discordium/Utils';
import { classNames } from '@discordium/modules';
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
                ]
            }
        });
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

        const { TooltipContainer, Clickable } = BDFDB.LibraryComponents;

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
        const [rolesListProps] = userPopoutBody.propsWith<Roles>("userRoles");
        if (!rolesListProps) return;

        const rolesList = $(`.${rolesListProps.className}`);
        const roleComponents = rolesList.children().map((role, i) => {
            const {children, ...roleProps} = $(role).props as Role;
            // const guildRole = props.guild.roles[props.guildMember.roles[i]];
            if (roleProps.style) roleProps.style['backgroundColor'] = roleProps.style.borderColor?.replace('0.6', '0.09');
            
            return (
                <div data-is-danho="true" {...roleProps} onClick={e => children[0].props.onClick(e)}>
                    {children}
                </div>
            )
        })

        const { className, ..._rolesListProps } = rolesListProps;
        result.props.children[1].props.children.splice(1, 0, (
            <div {..._rolesListProps} className={classNames(ZLibrary.DiscordClassModules.PopoutRoles.root, className)}>
                {roleComponents}
            </div>
        ));
        console.log(result);
        return result;
    }
    
    patchRole(...[record, fiber, props]: MutationReturns['user-popout']) {
        console.log({ record, fiber, props })
        
        return true;
    }
}

export default createPlugin(config, api => new DanhoDiscordV2(api));