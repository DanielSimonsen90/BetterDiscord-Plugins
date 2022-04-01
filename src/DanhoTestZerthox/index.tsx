import { React, createPlugin, Finder, Utils } from 'discordium';
import config from './config.json';
import styles from './styles.scss';

const guildStyles = Finder.byProps("guilds", "base");
const HomeButton = Finder.byProps('HomeButton');
const Tooltip = Finder.byProps("TooltipContainer");
const Clickable = Finder.byName("Clickable");

export default createPlugin({ ...config, styles }, ({ Data, Logger, Patcher, Settings, Styles }) => {
    const triggerRerender = async () => {
        const node = document.getElementsByClassName(guildStyles.guilds)?.[0];
        const fiber = Utils.getFiber(node);
        if (await Utils.forceFullRerender(fiber)) {
            Logger.log("Rerendered guilds");
        } else {
            Logger.warn("Unable to rerender guilds");
        }
    };

    return {
        start() {
            Logger.log('Started plugin');

            Patcher.after(HomeButton, "HomeButton", ({ original: HomeButton, args, result }) => {
                console.log('After HomeButton', { HomeButton, args, result, Tooltip, Clickable });
                const [props] = args;

                // return (
                //     <Tooltip text="Hello, World!">¨
                //         <Clickable>
                //             <HomeButton {...props} />
                //         </Clickable>
                //     </Tooltip>
                // )
                return result;
            });
            Patcher.before(Tooltip, "render", ({ args, result }) => {
                console.log('Before Tooltip', { Tooltip, args, result });
                const [props] = args;

                return result;
            })

            triggerRerender();
        },
        stop() {
            Logger.log('Stopped plugin');
            triggerRerender();
        },
    }
});