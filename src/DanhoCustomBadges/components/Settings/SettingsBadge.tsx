import { User } from '@discord';
import ZLibrary from '@ZLibrary';
import { React, Modules } from 'discordium';
import { BadgeData } from '../../Settings/types';

const { useState, useMemo, useCallback } = React;
const { TextInput, Button } = Modules;
const { FormItem } = Modules.Form;

type SettingsBadgeProps = {
    badge: BadgeData,
    user: User,
    length: number,

    onUpdate: (badge: BadgeData) => void,
    onDelete: () => void,
}
export default function SettingsBadge({ badge, user, onUpdate, onDelete }: SettingsBadgeProps) {
    const [tooltip, setTooltip] = useState(badge.tooltip);
    const [src, setSrc] = useState(badge.src);
    const [href, setHref] = useState(badge.href);

    const index = useMemo(() => badge.index, [badge]);
    const update = useMemo(() => ({ tooltip, index, src, href }), [tooltip, index, src, href]);

    const { Margins } = ZLibrary.DiscordClassModules;

    const move = useCallback((offset: number) => {
        let newIndex = index + offset;
        if (newIndex < 0) newIndex = length - 1;
        else if (newIndex >= length) newIndex = 0;

        onUpdate({ ...update, index: newIndex });
    }, [index, length, onUpdate, update]);

    return (
        <div className="settings-badge">
            <div className="badge-form">
                <FormItem>
                    <TextInput className={Margins.marginBottom8} placeholder='https://media.discordapp.net/attachments/{channelId}/{messageId}}/unknown.png' value={src} onChange={setSrc} />
                    <TextInput className={Margins.marginBottom8} placeholder={`${user.username}'s new badge`} value={tooltip} onChange={setTooltip} />
                    <TextInput className={Margins.marginBottom8} placeholder='https://google.com' value={href} onChange={setHref} />
                </FormItem>
            </div>
            <div className="button-container">
                <Button size={Button.Sizes.SMALL} onClick={() => onUpdate(update)} color={Button.Colors.GREEN}>Update badge</Button>
                <Button size={Button.Sizes.SMALL} onClick={onDelete} color={Button.Colors.RED} >Delete</Button>
                <Button size={Button.Sizes.SMALL} onClick={() => move(-1)} color={Button.Colors.BRAND_NEW}>◀</Button>
                <Button size={Button.Sizes.SMALL} onClick={() => move(1)} color={Button.Colors.BRAND_NEW}>▶</Button>
            </div>
        </div>
    )
}