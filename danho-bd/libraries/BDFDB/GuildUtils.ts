import { Guild, GuildFolder } from "../../discord"

type GuildUtils = {
    is(guild: any): guild is Guild,
    getIcon(id: string): string,
    getBanner(id: string): string,
    getFolder(id: string): GuildFolder,
    openMenu(guild: Guild, e?: MouseEvent): void,
    markAsRead(guildIds: Array<string>): void,
    rerenderAll(instant: boolean): void,
}
export default GuildUtils;