import type { Snowflake } from "../base";

export type GuildFolder = {
  folderColor: number,
  folderId: number,
  folderName: string,
  guildIds: Array<Snowflake>;
};