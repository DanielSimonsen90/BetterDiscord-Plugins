/**
 * @name DanhoBetterChat
 * @description Personal chat features
 * @author Danho#2105
 * @version 1.2.0
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

const { Message } = window.BDD.Modules.DanhoModules.CompiledReact.Components;
class DanhoBetterChatCommands extends Array {
    constructor(logger, ...commands) {
        super(...commands);
        this.logger = logger;
        this.prefix = "!bdd";
    }
    run(content) {
        const [prefix, name, ...args] = content.split(" ");
        if (prefix !== this.prefix)
            return;
        const command = this.find(command => command.name === name || command.aliases.includes(name));
        if (!command)
            return;
        const props = args.join(' ').split(' @').reduce((props, arg) => {
            const [key, value] = arg.split('=');
            props[key.slice(1)] = value;
            return props;
        }, {});
        return command.run(window.BDD, window.BDD.Modules.React, Message, props);
    }
}
class DanhoBetterChatCommand {
    constructor(name, description, usage, aliases, run) {
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.aliases = aliases;
        this.run = run;
    }
}
function buildCommand(name, description, usage, aliases, run) {
    return new DanhoBetterChatCommand(name, description, usage, aliases, run);
}

const say = buildCommand("say", "Say something I'm giving  up on you", 'message="Hello World"', [], async (Lib, React, Message, props) => {
    return React.createElement(Message, { content: props.message });
});

const spagSmells = buildCommand("spag-smells", "Tell spag he smells", '', ["smelly"], async (Lib, React, Message, props) => {
    const { UserStore } = Lib.Libraries.ZLibrary.DiscordModules;
    const spag = Object.values(UserStore.getUsers()).find(user => user.username === "Pebbles");
    return React.createElement(Message, { content: `@${spag.username} you smell lol`, suppressPing: true });
});

const Commands = (logger) => new DanhoBetterChatCommands(logger, say, spagSmells);
const Commands$1 = Commands;

const name = "DanhoBetterChat";
const description = "Personal chat features";
const author = "Danho#2105";
const version = "1.2.0";
const config = {
	name: name,
	description: description,
	author: author,
	version: version
};

const REGEX = {
    AtSomeone: /@someone/g,
    Timestamp: /<(?<calendar>([0-2]\d|3[0-1])?(-|\/)((0\d)|(1[0-2]))?(-|\/)((19\d{2})|(20\d{2})|(\d{1,2})))?.?(?<time>((2[0-3])|([0-1]\d))((:|.)[0-5]\d)?((:|.)[0-5]\d)?((:|.)\d{1,4})?)?(?<format>:[tTdDfFR]|)?>/g,
    Command: /!bdd/g
};
const index = window.BDD.PluginUtils.buildPlugin({ ...config }, (Lib) => {
    const Plugin = Lib.GetPlugin();
    const { $ } = Lib.Modules.DanhoModules;
    const { currentChannel, currentGuildMembers } = Lib.Utils;
    return class DanhoBetterChat extends Plugin {
        constructor() {
            super(...arguments);
            this.chatMatches = [
                [REGEX.AtSomeone, this.onAtSomeone.bind(this)],
                [REGEX.Timestamp, this.onTimestamp.bind(this)],
                [REGEX.Command, this.onCommand.bind(this)],
            ];
            this.commands = Commands$1(this.logger);
            this.insteadSendMessageModule = async ({ args: [messageId, { content, ...props }, ...args], original: sendMessage }) => {
                const matches = this.chatMatches.filter(([regex]) => content.match(regex));
                for (const [regex, callback] of matches) {
                    const executed = regex.exec(content);
                    this.logger.log(`Executed ${regex}`, regex, executed, content);
                    try {
                        content = await callback(regex, executed, content);
                    }
                    catch (err) {
                        if (err instanceof Error && err.message.includes("Message aborted"))
                            return "Message cancelled";
                        this.logger.error(err);
                        throw err;
                    }
                }
                return sendMessage(messageId, { content, ...props }, ...args);
            };
        }
        onAtSomeone(regex, matches, content) {
            const members = currentGuildMembers.filter(({ userId }) => this.BDFDB.UserUtils.can("VIEW_CHANNEL", userId, currentChannel.id));
            const member = members[Math.floor(Math.random() * members.length)];
            content = content.replace(regex, `<@${member.userId}>`);
            return content;
        }
        onTimestamp(regex, matches, content) {
            const { groups: { calendar, time, format } } = matches;
            const now = new Date();
            const [{ day, month, year }, { hour, minute, second, millisecond }] = [getCalendar(), getTime()];
            const date = new Date(year, month - 1, hour < now.getHours()
                && day === now.getDate()
                && month === now.getMonth()
                && year === now.getFullYear()
                ? day + 1 : day, hour, minute, second, millisecond);
            const unix = Math.round(date.getTime() / 1000);
            return content.replace(regex, `<t:${unix}${format ?? ''}>`);
            function getCalendar() {
                const current = {
                    day: now.getDate(),
                    month: now.getMonth() + 1,
                    year: now.getFullYear()
                };
                if (!calendar)
                    return current;
                const calendarSep = calendar.match(/\D/)?.[0];
                let [day, month, year] = calendar.split(calendarSep).map(Number);
                year ?? (year = current.year);
                if (year <= 50)
                    year += 2000;
                else if (year <= 99)
                    year += 1900;
                return {
                    day: (day != NaN && day) ?? current.day,
                    month: (month != NaN && month) ?? current.month,
                    year: (year != NaN && year) ?? current.year,
                };
            }
            function getTime() {
                const current = {
                    hour: now.getHours(),
                    minute: now.getMinutes(),
                    second: now.getSeconds(),
                    millisecond: now.getMilliseconds(),
                };
                if (!time)
                    return current;
                const timeSep = time.match(/\D/)?.[0];
                const [hour, minute, second, millisecond] = time.split(timeSep).map(Number);
                return {
                    hour: (hour != NaN && hour) ?? current.hour,
                    minute: (minute != NaN && minute) ?? current.minute,
                    second: (second != NaN && second) ?? current.second,
                    millisecond: (millisecond != NaN && millisecond) ?? current.millisecond,
                };
            }
        }
        async onCommand(regex, matches, content) {
            const chatContainer = $(s => s.tagName("ol").and.data("list-id", "chat-messages"));
            try {
                chatContainer.lastChild.insertComponent("beforebegin", await this.commands.run(content));
            }
            catch (err) {
                this.logger.error(`[Commands]`, err);
                throw err;
            }
            throw new Error("Message aborted");
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

            name = 'DanhoBetterChat';
            isLib = 'DanhoBetterChat' === 'DanhoLibrary'
        }
    }

    return module.exports;
})();
/*@end @*/
