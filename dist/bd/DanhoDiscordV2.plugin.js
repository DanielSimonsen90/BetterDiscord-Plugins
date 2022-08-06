/**
 * @name DanhoDiscordV2
 * @description Rework of the original DanhoDiscord plugin
 * @author Danho#2105
 * @version 0.0.1
 * @authorLink https://github.com/DanielSimonsen90
 * @website https://github.com/DanielSimonsen90/BetterDiscord-Plugins
 * @source https://github.com/DanielSimonsen90/BetterDiscord-Plugins/tree/master/src/DanhoDiscordV2
 * @updateUrl https://raw.githubusercontent.com/DanielSimonsen90/BetterDiscord-Plugins/master/dist/bd/DanhoDiscordV2.plugin.js
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

const name = "DanhoDiscordV2";
const description = "Rework of the original DanhoDiscord plugin";
const author = "Danho#2105";
const version = "0.0.1";
const config = {
	name: name,
	description: description,
	author: author,
	version: version
};

const index = window.BDD.PluginUtils.buildPlugin(config, Lib => {
    const Plugin = Lib.GetPlugin();
    const { $ } = Lib.Modules.DanhoModules;
    return class DanhoDiscordV2 extends Plugin {
        async start() {
            super.start({
                after: {
                    default: {
                        UserPopoutBody: { isModal: true }
                    },
                }
            });
        }
        patchUserPopoutBody({ args: [props], result }) {
            const userPopoutBody = $(`.${result.props.className}`);
            if (!userPopoutBody.element)
                return;
            const [rolesListProps] = userPopoutBody.propsWith("userRoles");
            if (!rolesListProps)
                return;
            const rolesList = $(`.${rolesListProps.className}`);
            if (!rolesList.element)
                return;
            rolesList.children('* > div[class*="role"]:not(div[class*="addButton"])').forEach((role, i) => {
                if (role.style?.borderColor)
                    role.style.backgroundColor = role.style.borderColor?.replace('0.6', '0.09');
            });
        }
    };
});

module.exports = index;

    } catch (err) {
        if (window.BDD) console.error(err);
        module.exports = class NoPlugin {
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

            name = 'DanhoDiscordV2';
            isLib = 'DanhoDiscordV2' === 'DanhoLibrary'
        }
    }

    return module.exports;
})();
/*@end @*/
