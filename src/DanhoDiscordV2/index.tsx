import Clickable from 'danho-bd/libraries/BDFDB/LibraryComponents/Clickable';
import TooltipContainer from 'danho-bd/libraries/BDFDB/LibraryComponents/TooltipContainer';
import { BDFDB, DanhoPlugin, createPlugin, Discord, React, $, ZLibrary } from 'danho-discordium';
import { Finder } from 'discordium/api';
import { ReactProvider } from 'react-reconciler';
import config from './config.json';

class DanhoDiscordV2<
    SettingsType extends Record<string, any>,
    DataType extends Record<"settings", SettingsType> = Record<"settings", SettingsType>
> extends DanhoPlugin<SettingsType, DataType> {
    async start() {
        super.start();
        // super.start({
        //     after: {
        //         default: [{
        //             selector: "UserProfileBadgeList",
        //             isModal: true
        //         }]
        //     }
        // });
      
        const UserProfileModalHeader = Finder.byName("UserProfileModalHeader");
        console.log(UserProfileModalHeader);
        const callback = () => {
            this.logger.log('Hello there');
            return <div>Hello</div>;
        }

        this.patcher.after(UserProfileModalHeader, "default", callback);

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

    async patchUserProfileBadgeList({ args: [props], result }: {
        args: [{
            className: string,
            openPremiumSettings(): void,
            premiumGuildSince: Date,
            premiumSince: Date,
            size: number,
            user: Discord.User
        }],
        result: ReactProvider<null>
    }) {
        console.log('UserProfileBadgeList', props, result);
        
        if (!Array.isArray(result.props.children)) return;

        const ref = $(`.${props.className}`);
        if (!ref.element) return;

        const classes = {
            clickable: ref.children(s => s.className("clickable", 'div'), true).classes,
            img: ref.children(s => s.className("profileBadge", 'img'), true).classes
        }

        result.props.children.splice(3, 0, (React.createElement<TooltipContainer['defaultProps']>(BDFDB.LibraryComponents.TooltipContainer, {
            text: 'Crazy badge bro',
            spacing: 24,
            children: React.createElement<Clickable["defaultProps"]>(BDFDB.LibraryComponents.Clickable as any, {
                "aria-label": 'Test badge',
                className: `${classes.clickable} test-badge`,
                role: 'button',
                tabIndex: 0,
                children: <img alt=' ' aria-hidden={true} src="https://media.discordapp.net/attachments/767713017274040350/768002085052088351/PinguDev.png" className={classes.img} />
            }) as JSX.Element
        })))
    }
}

export default createPlugin(config, api => new DanhoDiscordV2(api));