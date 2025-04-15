import { Channel, Guild } from "@discord/types";
import { getMeta } from "@dium";
import { Embed } from "@dium/components";
import { Arrayable, Promiseable } from "./types";

export enum SlashCommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
}

type SlashCommandCreationOptions = {
  id?: string;
  name: string;
  description?: string;
  options?: Array<{
    name: string;
    description: string;
    required?: boolean;
    type: SlashCommandOptionType;
    choices?: Array<{ name: string; value: string; }>;
  }>,
  execute: SlashCommandExecuteFunction;
};

type SlashCommandOption = {
  focused: undefined | true;
  name: string;
  type: SlashCommandOptionType;
  value: any; // TODO, when you have nothing better to do
};

type SlashCommandContext = {
  channel: Channel;
  guild: Guild | null;
};

type BDMessage = {
  content?: string;
  embeds?: Arrayable<Embed>;
};
type SlashCommandExecuteFunction = (options: Array<SlashCommandOption>, context: SlashCommandContext) => Promiseable<void | BDMessage>;

export function createSlashCommand(options: SlashCommandCreationOptions) {
  const pluginName = getMeta().name;

  // @ts-expect-error
  return BdApi.Commands.register(pluginName, {
    id: `${pluginName}-${options.name}`,
    ...options,
  }) as () => void;
}

export function deleteAllSlashCommands() {
  const pluginName = getMeta().name;

  // @ts-expect-error
  BdApi.Commands.unregisterAll(pluginName);
}

export const SlashCommandUtils = {
  createSlashCommand,
  deleteAllSlashCommands,
  SlashCommandOptionType,
}

export default SlashCommandUtils;