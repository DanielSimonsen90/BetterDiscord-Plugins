import { User } from "@discord";
import { Finder } from "@discordium/api";

export interface DiscordTagModule extends React.FunctionComponent<{
    hideDiscriminator?: boolean,
    user: User,
    nick?: string,
    
    className?: string,
    discriminatorClassName?: string,
}> {

}
export const DiscordTag: DiscordTagModule = Finder.byName("DiscordTag");
export default DiscordTag;