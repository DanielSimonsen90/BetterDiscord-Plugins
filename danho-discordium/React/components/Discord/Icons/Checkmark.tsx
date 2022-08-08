import { React } from '@discordium/modules';

type Props = {
    tooltip: string
}

export default function Checkmark({ tooltip }: Props) {
    return (
        <svg aria-label={tooltip} className={window.BDFDB.DiscordClassModules.BotTag.botTagVerified}
            aria-hidden={false}
            width="16" height="16" viewBox="0 0 16 15.2">
            <path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path>
        </svg>
    )
}