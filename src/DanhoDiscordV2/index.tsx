import { BDFDB, DanhoPlugin, createPlugin, React, $ } from 'danho-discordium';
import { PatchReturns } from 'danho-discordium/Patcher';
import { Finder } from 'discordium/src';
import config from './config.json';

class DanhoDiscordV2<
    SettingsType extends Record<string, any>,
    DataType extends Record<"settings", SettingsType> = Record<"settings", SettingsType>
> extends DanhoPlugin<SettingsType, DataType> {
    async start() {
        // super.start();
        super.start({
            after: {
                default: [
                    { selector: "UserProfileBadgeList", isModal: true },
                    { selector: "UserPopoutBody", isModal: true },
                    { selector: ["canRemove", "guildId", "onRemove", "role"], isModal: true, callback: 'patchRole' }
                ]
            }
        });

        // const Role = await this.patcher.waitForModal(() => Finder.query({ props: ["canRemove", "guildId", "onRemove", "role"] }));
        // console.log('Role', Role);

        // const UserProfileBadgeList = await this.patcher.waitForContextMenu(
        //     () => Finder.query({name: "UserProfileBadgeList"}) as {default: (channel: Discord.Channel) => JSX.Element}
        // );

        // // add queue clear item
        // this.patcher.after(UserProfileBadgeList, "default", ({result}) => {
        //     console.log('I found you!')
        // });

        // this.on(new ObservationConfig("chat-messages-content", this.$(`[data-list-id="chat-messages"]`).parent.element, 
        //     function(record, callback) {
        //         if (!MutationManager.isDirectChild(this.element, record.target)) return;
                
        //         callback(record);
        //     }, 'channel-change'), 
        //     this.makeButton.bind(this)
        // );

        // this.on('channel-change', function(record, { channel }, manipulator) {

        //     return true;
        // })

        // this.on('user-popout-render', (record, { userId }, manipulator) => {
        //     // console.log(manipulator);
        //     if (userId !== this.BDFDB.UserUtils.me.id) return;

        //     manipulator.addBadge({
        //         clickable: {
        //             ariaLabel: 'Test badge',
        //             onClick: (e) => {
        //                 let value = '';
        //                 console.log('Badge context menu', e);

        //                 return this.ZLibrary.ContextMenu.openContextMenu(e, this.ZLibrary.ContextMenu.buildMenuChildren({
        //                     label: 'Test badge',
        //                     type: 'group',
        //                     items: [{
        //                         label: 'This is a test context menu',
        //                         type: 'submenu',
        //                         items: [{
        //                             label: 'Test submenu',
        //                             type: 'custom',
        //                             render: () => {
        //                                 const [text, setText] = React.useState(value);
        //                                 return (
        //                                     <form>
        //                                         <input type="password" onChange={e => setText(e.target.value)} value={text} />
        //                                         <button type="submit" onClick={() => value = text}>Okay!</button>
        //                                     </form>
        //                                 )
        //                             },
        //                             onClose: () => BdApi.showToast(`You entered: ${value}`)
        //                         }]
        //                     }]
        //                 }), {
        //                     align: 'right',
        //                     position: 'right'
        //                 })
        //             }
        //         },
        //         img: {
        //             src: 'https://media.discordapp.net/attachments/767713017274040350/768002085052088351/PinguDev.png', 
        //         }
        //     })
        //     return true;
        // })
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
    patchRole({ args: [props], result }: PatchReturns["Role"]) {
        console.log('Role', {
            props,
            result
        })
    }
}

export default createPlugin(config, api => new DanhoDiscordV2(api));