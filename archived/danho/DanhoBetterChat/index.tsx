// import styles from './style.scss';
import Commands from "./Commands";
import config from './config.json';
import { PatchReturns } from "danho-discordium/Patcher";

type Settings = {}

type ChatMatchConfig = [RegExp, (regex: RegExp, matches: RegExpExecArray, content: string) => string];

const REGEX = {
    AtSomeone: /@someone/g,
    Timestamp: /<(?<calendar>([0-2]\d|3[0-1])?(-|\/)((0\d)|(1[0-2]))?(-|\/)((19\d{2})|(20\d{2})|(\d{1,2})))?.?(?<time>((2[0-3])|([0-1]\d))((:|.)[0-5]\d)?((:|.)[0-5]\d)?((:|.)\d{1,4})?)?(?<format>:[tTdDfFR]|)?>/g,
    Command: /!bdd/g
}

export default window.BDD.PluginUtils.buildPlugin<Settings>({ ...config }, (Lib) => {
    const Plugin = Lib.GetPlugin<Settings>();
    const { $ } = Lib.Modules;
    const { currentChannel, currentGuildMembers } = Lib.Utils;

    return class DanhoBetterChat extends Plugin {
        public chatMatches: Array<ChatMatchConfig> = [
            [REGEX.AtSomeone, this.onAtSomeone.bind(this)],
            [REGEX.Timestamp, this.onTimestamp.bind(this)],
            [REGEX.Command, this.onCommand.bind(this)],
        ];
        public commands = Commands(this.logger);
        private timesAttempted = 0;
        private _lastMessage: string | undefined;

        insteadSendMessageModule = ({ args: [messageId, { content, ...props }, ...args], original: sendMessage }: PatchReturns["Message"]) => {
            // if (content === this._lastMessage) this.logger.warn(`[insteadSendMessage]`, `Attempted to send ${messageId} ${++this.timesAttempted} times`, {
            //     messageId, content, props, args
            // });
            const typeTest = content.toLowerCase() === "random type test" || content.toLowerCase() === "rtt";

            const matches = this.chatMatches.filter(([regex]) => content.match(regex));
            if (typeTest) this.logger.log(`[TypeTest]: Matched regex`, matches);

            for (const [regex, callback] of matches) {
                const executed = regex.exec(content);
                if (typeTest) this.logger.log(`[TypeTest]: Executed regex`, executed);
                this.logger.log(`Executed ${regex}`, regex, executed, content);

                try {
                    if (typeTest) this.logger.log(`[TypeTest]: Executing callback for ${regex}`, callback);
                    content = callback(regex, executed, content);
                    if (typeTest) this.logger.log(`[TypeTest]: Executed callback for ${regex}`, content);
                } catch (err) {
                    this.logger.log(`[TypeTest]: Error executing callback for ${regex}`, err);

                    if (err instanceof Error && err.message.includes("Message aborted"))
                        return "Message cancelled";

                    if (typeTest) this.logger.error(`[TypeTest]: Error executing callback for ${regex}`, err);
                    this.logger.error(err);
                    throw err;
                }
            }

            if (typeTest) this.logger.log(`[TypeTest]: Sending message`, { messageId, content, ...props, ...args });
            return sendMessage(messageId, { content, ...props }, ...args);
        }

        onAtSomeone(regex: RegExp, matches: RegExpExecArray, content: string) {
            const members = currentGuildMembers.filter(({ userId }) => this.BDFDB.UserUtils.can("VIEW_CHANNEL", userId, currentChannel.id));
            const member = members[Math.floor(Math.random() * members.length)];
            content = content.replace(regex, `<@${member.userId}>`);
            return content;
        }
        onTimestamp(regex: RegExp, matches: RegExpExecArray, content: string) {
            const { groups: { calendar, time, format } } = matches;
            const now = new Date();
            const [{ day, month, year }, { hour, minute, second, millisecond }] = [getCalendar(), getTime()];
            const date = new Date(
                year,
                month - 1,
                hour < now.getHours()
                    && day === now.getDate()
                    && month === now.getMonth()
                    && year === now.getFullYear()
                    ? day + 1 : day,
                hour,
                minute,
                second,
                millisecond
            );

            const unix = Math.round(date.getTime() / 1000);

            return content.replace(regex, `<t:${unix}${format ?? ''}>`);

            function getCalendar() {
                const current = {
                    day: now.getDate(),
                    month: now.getMonth() + 1,
                    year: now.getFullYear()
                };

                if (!calendar) return current;

                const calendarSep = calendar.match(/\D/)?.[0];
                let [day, month, year] = calendar.split(calendarSep).map(Number);

                year ??= current.year;
                if (year <= 50) year += 2000;
                else if (year <= 99) year += 1900;

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

                if (!time) return current;

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
        onCommand(regex: RegExp, matches: RegExpExecArray, content: string) {
            const chatContainer = $(s => s.tagName("ol").and.data("list-id", "chat-messages"));

            try {
                chatContainer.lastChild.insertComponent(
                    "beforebegin",
                    this.commands.run(content)
                );
            } catch (err) {
                this.logger.error(`[Commands]`, err);
                throw err;
            }

            throw new Error("Message aborted");
        }
    } as any;
});