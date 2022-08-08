import { User } from "@discord";

type DiscordTag = React.FunctionComponent<{
    hideDiscriminator?: boolean,
    user: User,
    nick?: string,

    className?: string,
    discriminatorClassName?: string,
}>
export default DiscordTag;