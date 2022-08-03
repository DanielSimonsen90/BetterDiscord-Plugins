/**
 * @name DanhoGlasses
 * @description Preferred Discord styles
 * @author Danho#2105
 * @version 0.0.1
 * @authorLink https://github.com/DanielSimonsen90
 * @website https://github.com/DanielSimonsen90/BetterDiscord-Plugins
 * @source https://github.com/DanielSimonsen90/BetterDiscord-Plugins/tree/master/src/DanhoGlasses
 * @updateUrl https://raw.githubusercontent.com/DanielSimonsen90/BetterDiscord-Plugins/master/dist/bd/DanhoGlasses.plugin.js
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

const styles = ".role-2TIOKu {\n  background: var(--background);\n  border: 1px solid;\n  border-radius: 8px;\n  box-shadow: 0px 1px var(--background-tertiary);\n  justify-content: center;\n  flex: 1 1 25%;\n}\n\nbutton.role-2TIOKu {\n  color: var(--background-secondary);\n  transition: 0.5s ease-in-out;\n}\n\nbutton.role-2TIOKu:hover {\n  color: var(--background-accent);\n  transition: 0.5s ease-in-out;\n}\n\n.addButton-1_dZYu, button.role-2TIOKu.addButton-1_dZYu {\n  color: var(--interactive-muted);\n  flex: 1 0 100%;\n  background-color: var(--background-4);\n}\n\n.addButtonIcon-3HZ_2f:hover, button.role-2TIOKu.addButton-1_dZYu:hover {\n  color: var(--interactive-normal);\n}\n\n.roleName-2ZJJYR {\n  white-space: unset;\n  max-width: unset;\n  margin: unset;\n  padding: 1px 2px;\n  width: max-content;\n}\n\n.roleCircle-1EgnFN {\n  display: none;\n}\n\n.roleIcon-3-WL_I.roleIcon-29epUq {\n  margin-right: 2px;\n}\n\n.bannerUpsellContainer-1KrLvE {\n  background-color: var(--background-quaternary) !important;\n}\n\n.tierHeaderUnlocked-3lTDnP {\n  background-color: var(--background-tertiary) !important;\n}\n\n.wrapper-18yWki {\n  background-color: var(--background-tertiary);\n}\n\n.tierBody-3aUxuc {\n  background-color: var(--background-quaternary) !important;\n}\n\n.notEnoughMembersError-16EXyM {\n  background-color: var(--background-quaternary) !important;\n}\n\n.paymentPane-3bwJ6A, .paginator-166-09 {\n  background-color: var(--background-tertiary) !important;\n}\n\n.payment-xT17Mq {\n  background-color: var(--background-quaternary) !important;\n}\n\n.headerBarContainer-31FKNA,\n.peopleList-2VBrVI, .container-2cd8Mz {\n  background-color: var(--background-secondary) !important;\n}\n\n.bd-error-modal > * {\n  background-color: var(--background-primary) !important;\n}\n\n.relationshipButtons-3ByBpj {\n  gap: 0.5em;\n}\n\ndiv[class*=root] > div[class*=body] {\n  height: unset;\n  max-height: 47vh;\n}\n\nheader .VoiceChannelField {\n  text-overflow: ellipsis;\n  white-space: pre;\n  overflow: hidden;\n  background-color: var(--bdfdb-green);\n  border-radius: 3px;\n  height: 28px;\n  max-width: 85px;\n  padding: 2px 8px;\n  margin: 0;\n  transition: all 0.2s ease-in-out;\n}\n\n.VoiceChannelField *[class*=contents] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n}\n\nheader .VoiceChannelField:hover *[class*=contents] {\n  animation: slide 5s infinite;\n}\n\n.VoiceChannelField span[class*=iconContainer] {\n  margin-right: 3px;\n}\n\n.VoiceChannelField .icon-2W8DHg {\n  color: var(--text-normal);\n}\n\n@keyframes slide {\n  0% {\n    transform: translateX(0);\n  }\n  100% {\n    transform: translateX(-65%);\n  }\n}\ndiv[class*=bodyInnerWrapper] .VoiceChannelField {\n  justify-content: center;\n}\n\ndiv.flowerStarContainer-1QeD-L.connectedAccountVerifiedIcon-2cA82O > svg.flowerStar-1GeTsn > path,\ndiv.flowerStarContainer-1QeD-L.partnered-3nJayh.background-2uufRq.guildBadge-3IDi4U.disableColor-2z9rkr > svg.flowerStar-1GeTsn > path {\n  fill: var(--blurple);\n}\n\n.expandedFolderBackground-1cujaW,\n.folder-1hbNCn[aria-expanded=true] {\n  background-color: var(--background-quaternary);\n}\n\n.homeIcon-FuNwkv {\n  color: var(--blurple);\n  transition: color 0.1s ease-in-out;\n}\n\n.wrapper-1BJsBx:hover .homeIcon-FuNwkv,\n.wrapper-1BJsBx.selected-bZ3Lue .homeIcon-FuNwkv,\ndiv[data-list-item-id=guildsnav___home] {\n  color: var(--interactive-active);\n}\n\ndiv[aria-label=Home] > .childWrapper-anI2G9 {\n  background-color: inherit;\n}\n\n.mentioned-Tre-dv {\n  --background-mentioned: var(--blurple-opacity);\n}\n\n.mentioned-Tre-dv {\n  --background-mentioned-hover: var(--blurple-classic-opacity);\n}\n\n.mentioned-Tre-dv::before {\n  background-color: var(--blurple);\n}\n\ncode.js {\n  background-color: var(--background-quaternary) !important;\n}\n\n.autocomplete-1vrmpx {\n  background-color: var(--background-quaternary) !important;\n}\n\n.categoryHeader-O1zU94 {\n  background-color: var(--background-tertiary);\n}\n\ninput[type=text] {\n  background-color: var(--background-tertiary);\n  border-radius: 6px;\n}\n\n/* Checkbox */\n.container-3auIfb {\n  background-color: var(--background-quinary);\n}\n\ndiv[class*=tooltipContent] {\n  text-align: center;\n}\n\n/*== Spotify ==*/\n.headerSpotify-zpWxgT.header-2BwW8b.size16-14cGz5,\n.topSectionSpotify-1lI0-P,\n.listeningAlong-30wH70 {\n  background-color: var(--spotify-listen-along) !important;\n}\n\n/*== Game Activity ==*/\n.headerPlaying-j0WQBV.header-2BwW8b.size16-14cGz5,\n.topSectionPlaying-1J5E4n,\n.panel-24C3ux.activityPanel-28dQGo {\n  background-color: var(--activity-game);\n}\n\n/*== SpotifyControls Panel*/\n.container-6sXIoE.withTimeline-824fT_, .wrapper-24pKcD button {\n  background-color: var(--spotify-controller) !important;\n}\n\n/*== Voice Chat Activity | Panel ==*/\n.wrapper-24pKcD {\n  background-color: var(--voice);\n}\n\n.activityText-yGKsKm {\n  color: var(--channels-default-dark);\n}\n\n.botTagRegular-kpctgU {\n  background: var(--botTag-background);\n}\n\n.botText-1fD6Qk {\n  font-size: 13px;\n}\n\n:root {\n  --blurple-classic: #7289da;\n  --blurple-classic-opacity: rgba(114, 137, 218, .1);\n  --blurple: #5865f2;\n  --blurple-opacity: rgba(88, 101, 242, .1);\n  --botTag-background: #3b3b3b;\n  --background-primary: rgb(10, 10, 10);\n  --background-secondary: rgb(12, 12, 12);\n  --background-secondary-alt: rgb(13, 13, 13);\n  --background-tertiary: rgb(15, 15, 15);\n  --background-quaternary: #181818;\n  --background-quinary: #222222;\n  --background-senary: #ccc;\n  --background-1: var(--background-primary);\n  --background-2: var(--background-secondary);\n  --background-2-1: var(--background-secondary-alt);\n  --background-3: var(--background-tertiary);\n  --background-4: var(--background-quaternary);\n  --background-5: var(--background-quinary);\n  --background-6: var(--background-senary);\n  --channeltextarea-background: var(--background-quaternary);\n  --channels-default: rgb(197, 202, 209);\n  --channels-default-dark: rgb(151, 156, 163);\n  --background-floating: var(--background-secondary);\n  --friends-content: #131111;\n  --box-shadow: 0px .2vh .4vh var(--background-quaternary);\n}\n\nh1, h2, h3, h4, h5, h6 {\n  text-transform: none !important;\n}\n\n.header-2RyJ0Y,\n.headerText-1HLrL7,\n.container-q97qHp,\n.botText-1fD6Qk,\n#bd-settings-sidebar {\n  text-transform: none;\n}\n\n.contentContainer-14yMzC,\n.contentContainer-14yMzC .header-2mZ9Ov,\n.sidebar-dLM-kh,\n.titleContainer-2CXtJo {\n  background-color: var(--background-secondary-alt);\n}";

const name = "DanhoGlasses";
const description = "Preferred Discord styles";
const author = "Danho#2105";
const version = "0.0.1";
const config = {
	name: name,
	description: description,
	author: author,
	version: version
};

const index = window.BDD.PluginUtils.buildPlugin({ ...config, styles }, (Lib) => {
    const Plugin = Lib.GetPlugin();
    return class DanhoGlasses extends Plugin {
    };
});

module.exports = index;

    } catch (err) {
        if ('DanhoGlasses' === 'DanhoLibrary') console.error(err);
        
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

            name = 'DanhoGlasses';
            isLib = 'DanhoGlasses' === 'DanhoLibrary'
        }
    }

    return module.exports;
})();
/*@end @*/
