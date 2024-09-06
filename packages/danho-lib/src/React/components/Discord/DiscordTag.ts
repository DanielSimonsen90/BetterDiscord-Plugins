import { User } from "@discord/types/user";
import { Finder } from "@dium/api";

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