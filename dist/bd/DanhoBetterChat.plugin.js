/**
 * @name DanhoBetterChat
 * @description Personal chat features
 * @author Danho#2105
 * @version 1.0.0
 * @authorLink https://github.com/DanielSimonsen90
 * @website https://github.com/DanielSimonsen90/BetterDiscord-Plugins
 * @source https://github.com/DanielSimonsen90/BetterDiscord-Plugins/tree/master/src/DanhoBetterChat
 * @updateUrl https://raw.githubusercontent.com/DanielSimonsen90/BetterDiscord-Plugins/master/dist/bd/DanhoBetterChat.plugin.js
**/

/*@cc_on @if (@_jscript)
var pluginName = WScript.ScriptName.split(".")[0];
var shell = WScript.CreateObject("WScript.Shell");
shell.Popup(
    "Do NOT run scripts from the internet with the Windows Script Host!\nMove this file to your BetterDiscord plugins folder.",
    0,
    pluginName + ": Warning!",
    0x1030
);
var fso = new ActiveXObject("Scripting.FileSystemObject");
var pluginsPath = shell.expandEnvironmentStrings("%appdata%\\BetterDiscord\\plugins");
if (!fso.FolderExists(pluginsPath)) {
    var popup = shell.Popup(
        "Unable to find BetterDiscord on your computer.\nOpen the download page of BetterDiscord?",
        0,
        pluginName + ": BetterDiscord not found",
        0x34
    );
    if (popup === 6) {
        shell.Exec("explorer \"https://betterdiscord.app\"");
    }
} else if (WScript.ScriptFullName === pluginsPath + "\\" + WScript.ScriptName) {
    shell.Popup(
        "This plugin is already in the correct folder.\nNavigate to the \"Plugins\" settings tab in Discord and enable it there.",
        0,
        pluginName,
        0x40
    );
} else {
    var popup = shell.Popup(
        "Open the BetterDiscord plugins folder?",
        0,
        pluginName,
        0x34
    );
    if (popup === 6) {
        shell.Exec("explorer " + pluginsPath);
    }
}
WScript.Quit();
@else @*/

module.exports = (() => {
    const module = { exports: null };
    try {
'use strict';

const name = "DanhoBetterChat";
const description = "Personal chat features";
const author = "Danho#2105";
const version = "1.0.0";
const config = {
	name: name,
	description: description,
	author: author,
	version: version
};

const index = window.BDD.PluginUtils.buildPlugin({ ...config }, (Lib) => {
    const Plugin = Lib.GetPlugin();
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
            });
        }
        patchSendMessage({ args: [messageId, { content, ...props }, ...args], original: sendMessage }) {
            if (!content?.includes("@someone"))
                return;
            const members = GuildMemberStore.getMembers(SelectedGuildStore.getGuildId());
            const matches = /@someone/g.exec(content);
            for (const match of matches) {
                const member = members[Math.floor(Math.random() * members.length)];
                content = content.replace(match, `<@${member.userId}>`);
            }
            return sendMessage(messageId, { content, ...props }, ...args);
        }
    };
});

module.exports = index;

    } catch (err) {
        if ('DanhoBetterChat' === 'DanhoLibrary') console.error(err);
        
        if (window.BDD) console.error(err);
        else module.exports = class NoPlugin {
            //start() { BdApi.Alert("this.name could not be loaded!") }
            start() {
                window.BDD_PluginQueue ??= [];

                if (!this.isLib) {
                    if (window.BDD_PluginQueue.includes(this.name)) return console.log(`${this.name} is already in plugin queue`, err);
                    window.BDD_PluginQueue.push(this.name); 
                } else {
                    setTimeout(() => {
                        BdApi.Plugins.reload(this.name);

                        setTimeout(() => window.BDD?.PluginUtils.restartPlugins(), 500);
                    }, 1000);
                }
            }
            stop() {}

            name = 'DanhoBetterChat';
            isLib = 'DanhoBetterChat' === 'DanhoLibrary'
        }
    }

    return module.exports;
})();
/*@end @*/
