// import styles from './style.scss';
import { PatchReturns } from "danho-discordium/Patcher";
import config from './config.json';

type Settings = {}

export default window.BDD.PluginUtils.buildPlugin<Settings>({ ...config }, (Lib) => {
    const Plugin = Lib.GetPlugin<Settings>();
    const { GuildMemberStore, SelectedGuildStore } = Lib.Libraries.ZLibrary.DiscordModules;

    return class DanhoBetterChat extends Plugin {
        async start() {
            super.start({
                instead: {
                    sendMessage: [{
                        selector: ["sendMessage"],
                        callback: this.patchSendMessage
                    }]
                }
            })
        }

        patchSendMessage({ args: [messageId, { content, ...props }, ...args], original: sendMessage }: PatchReturns["Message"]) {
            if (!content?.includes("@someone")) return;

            const members = GuildMemberStore.getMembers(SelectedGuildStore.getGuildId());
            const matches = /@someone/g.exec(content);
            for (const match of matches) {
                const member = members[Math.floor(Math.random() * members.length)];
                content = content.replace(match, `<@${member.userId}>`);
            }

            return sendMessage(messageId, { content, ...props }, ...args);
        }
    } as any;
});