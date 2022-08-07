import { Logger } from "@discordium/api";
const { Message } = window.BDD.Modules.DanhoModules.CompiledReact.Components;

type CommandCallback<Props> = (Lib: typeof window.BDD, React: typeof window.BDD.Modules.React, component: typeof Message, props: Props) => JSX.Element;

export default class DanhoBetterChatCommands extends Array<DanhoBetterChatCommand> {
    public constructor(private logger: Logger, ...commands: DanhoBetterChatCommand[]) {
        super(...commands);
    }

    public prefix = "!bdd";

    public run(content: string) {
        const [prefix, name, ...args] = content.split(" ");
        if (prefix !== this.prefix) return;

        const command = this.find(command => command.name === name || command.aliases.includes(name));
        if (!command) return;

        const props = args.join(' ').split(' @').reduce((props, arg) => {
            const [key, value] = arg.split('=');
            props[key.slice(1)] = value;
            return props;
        }, {} as any);

        return command.run(window.BDD, window.BDD.Modules.React, Message, props);
    }
}

export class DanhoBetterChatCommand<Props = any> {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly usage: string,
        public readonly aliases: Array<string>,
        public readonly run: CommandCallback<Props>
    ) { }
}

export function buildCommand<Props>(name: string, description: string, usage: string, aliases: Array<string>,
    run: CommandCallback<Props>
): DanhoBetterChatCommand {
    return new DanhoBetterChatCommand<Props>(name, description, usage, aliases, run);
}