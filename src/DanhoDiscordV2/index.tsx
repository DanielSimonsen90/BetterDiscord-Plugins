import { BDFDB, DanhoPlugin, createPlugin, React, $ } from 'danho-discordium';
import { MutationReturns, ObservationReturns } from 'danho-discordium/MutationManager';
import { PatchReturns } from 'danho-discordium/Patcher';
import config from './config.json';

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
            },
            mutations: {
                role: this.patchRole
            }
        });
    }

    patchUserProfileBadgeList({ args: [props], result }: PatchReturns["UserProfileBadgeList"]) {
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
        console.log({
            props,
            result
        })
    }
    
    patchRole(...[record, fiber, props]: MutationReturns['role']) {
        console.log({
            record, fiber, props
        })
        
        return true;
    }
}

export default createPlugin(config, api => new DanhoDiscordV2(api));