/**
 * @name UserVoiceShow
 * @version 0.0.7
 * @authorLink https://github.com/xmnlz
 * @source https://github.com/xmlnz/better-discord-stuff
 */
/*@cc_on
@if (@_jscript)

    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();
@else@*/

const request = require("request");
const fs = require("fs");
const path = require("path");

const config = {
  info: {
    name: "UserVoiceShow",
    authors: [
      {
        name: "xmlnz",
        discord_id: "339763421404725248",
      },
    ],
    version: "0.0.7",
    description:
      "The UserVoiceShow plugin allows you to find out the voice channel where the user is sitting.",
  },
};

module.exports = global.ZeresPluginLibrary
  ? (([Plugin, Library]) => {
      const {
        DiscordModules,
        Patcher,
        WebpackModules,
        PluginUtilities,
        Settings,
        PluginUpdater,
      } = Library;
      const { React, ChannelActions, ChannelStore, GuildStore, UserStore } =
        DiscordModules;
      const modules = {
        UserPopoutBody: WebpackModules.find(
          (m) => m?.default?.displayName === "UserPopoutBody" && m.default.toString().indexOf("ROLES_LIST") > -1
        ),
        VoiceStates: WebpackModules.getByProps("getVoiceStateForUser"),
      };
      let channelName;

      class VoiceChannelField extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            channelName: "",
          };
        }
        render() {
          const props = {
            className: "VoiceChannelField actionButton-iarQTd button-f2h6uQ lookFilled-yCfaCM colorGreen-3y-Z79 sizeSmall-wU2dO- grow-2sR_-F", 
            onClick: this.props.onClick
          }
          return this.props.renderAsButton ? 
            React.createElement("button", props, React.createElement("div", {
              className: window.BDFDB?.DiscordClassModules.Button.contents || "contents-3ca1mk"
            }, channelName)) : 
            React.createElement("div", props, channelName);
        }
      }
      class plugin extends Plugin {
        constructor() {
          super();
          this.settings = {
            useProfileModal: false,
          };
        }

        onStart() {
          this.initialize();
        }

        onStop() {
          Patcher.unpatchAll();
          PluginUtilities.removeStyle("VoiceChannelField");
        }

        initialize() {
          this.preLoadSetting();
          PluginUpdater.checkForUpdate(
            config.info.name,
            config.info.version,
            "https://raw.githubusercontent.com/xmlnz/better-discord-stuff/main/UserVoiceShow/UserVoiceShow.plugin.js"
          );
          this.patchUserPopoutBody();
          (async () => {
            await this.pathUserProfileModalHeader();
          })();

          PluginUtilities.addStyle(
            "VoiceChannelField",
            `
            .VoiceChannelField{margin:5px 0px;text-align:center;padding:5px;color:#fff!important;font-size:16px!important;border-radius:7px;display:flex;align-items:center}
            .VoiceChannelField:hover{background:#06c;cursor: pointer;}`
          );
        }

        async pathUserProfileModalHeader() {
          const UserProfileModalHeader = await new Promise((resolve) => {
            const cached = WebpackModules.getModule(
              (m) =>
                m &&
                m.default &&
                m.default.displayName === "UserProfileModalHeader"
            );
            if (cached) return resolve(cached);
            const unsubscribe = WebpackModules.addListener((module) => {
              if (
                !module.default ||
                module.default.displayName !== "UserProfileModalHeader"
              )
                return;
              unsubscribe();
              resolve(module);
            });
          });
          Patcher.after(
            UserProfileModalHeader,
            "default",
            (_, [props], ret) => {
              if (!this.settings.useProfileModal) return;
              if (UserStore.getCurrentUser().id === props.user.id) return ret;
              let channel = modules.VoiceStates.getVoiceStateForUser(
                props.user.id
              );
              if (channel === undefined) return ret;
              let channelObj = ChannelStore.getChannel(channel.channelId);
              if (channelObj.name === "") return ret; // This happens when the user is in a voice call.
              try {
                channelName = `${
                  GuildStore.getGuild(channelObj.guild_id).name
                } | ${channelObj.name}`;
              } catch (error) {
                channelName = channelObj.name;
              }
              let { props: actionButtonProps } = ret.props.children[1].props.children[1].props.children[1];
              actionButtonProps.children = [React.createElement(VoiceChannelField, {
                renderAsButton: true,
                onClick: (e) => {
                  ChannelActions.selectVoiceChannel(channel.channelId);
                },
              }), ...actionButtonProps.children];
            }
          );
        }

        patchUserPopoutBody() {
          Patcher.after(
            modules.UserPopoutBody,
            "default",
            (_, [props], ret) => {
              let channel = modules.VoiceStates.getVoiceStateForUser(
                props.user.id
              );
              if (UserStore.getCurrentUser().id === props.user.id) return ret;
              if (channel === undefined) return ret;
              let channelObj = ChannelStore.getChannel(channel.channelId);
              if (channelObj.name === "") return ret; // This happens when the user is in a voice call.
              try {
                channelName = `${
                  GuildStore.getGuild(channelObj.guild_id).name
                } | ${channelObj.name}`;
              } catch (error) {
                channelName = channelObj.name;
              }
              ret.props.children.push(
                React.createElement(VoiceChannelField, {
                  onClick: (e) => {
                    ChannelActions.selectVoiceChannel(channel.channelId);
                  },
                })
              );
            }
          );
        }
        getSettingsPanel() {
          return new Settings.Switch(
            "Display in profile",
            "When enabled, the channel will also be visible in the user profile.",
            this.settings.useProfileModal,
            (val) => {
              this.setAllSettings(val);
            }
          ).getElement();
        }

        setAllSettings(statement) {
          this.settings.useProfileModal = statement;
          BdApi.setData(config.info.name, "useProfileModal", statement);
        }

        preLoadSetting() {
          const loadData = BdApi.getData(config.info.name, "useProfileModal");
          this.settings.useProfileModal = loadData ? loadData : false;
        }
      }

      return plugin;
    })(global.ZeresPluginLibrary.buildPlugin(config))
  : class {
      constructor() {
        this._config = config;
      }

      load() {
        BdApi.showConfirmationModal(
          "Library plugin is needed",
          `The library plugin needed for PluginBuilder is missing. Please click Download Now to install it.`,
          {
            confirmText: "Download",
            cancelText: "Cancel",
            onConfirm: () => {
              request.get(
                "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                (error, response, body) => {
                  if (error)
                    return electron.shell.openExternal(
                      "https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
                    );

                  fs.writeFileSync(
                    path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"),
                    body
                  );
                }
              );
            },
          }
        );
      }

      start() {}

      stop() {}
    };
/*@end@*/
