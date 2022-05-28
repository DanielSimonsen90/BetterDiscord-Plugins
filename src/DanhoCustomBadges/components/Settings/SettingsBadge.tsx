import { User } from '@discord';
import { BadgeData } from '../../Settings/types';

const { React, DanhoModules } = window.BDD.Modules;
const { useState, useMemo, useCallback } = React;
const { Button, TextInput, Form: { FormItem }, Margins } = DanhoModules.CompiledReact.Components.Discord;

type SettingsBadgeProps = {
    badge: BadgeData,
    user: User,

    onUpdate: (badge: BadgeData) => void,
    onDelete: () => void,
}
export default function SettingsBadge({ badge, user, onUpdate, onDelete }: SettingsBadgeProps) {
    const [tooltip, setTooltip] = useState(badge.tooltip);
    const [src, setSrc] = useState(badge.src);
    const [href, setHref] = useState(badge.href);

    const [index, setIndex] = useState(badge.index.toString() ?? "0");
    const update = useMemo<BadgeData>(() => ({ ...badge, tooltip, index: parseInt(index), src, href }), [tooltip, index, src, href]);

    const move = useCallback((offset: number) => {
        let newIndex = parseInt(index) + offset;
        if (newIndex < 0) newIndex = 0;

        onUpdate({ ...update, index: newIndex });
    }, [index, length, onUpdate, update]);
    const onTextChange = useCallback((value: string) => {
        if (!value) return setIndex("");

        let timeout: NodeJS.Timeout;
        setIndex(value);
        clearTimeout(timeout);
        timeout = setTimeout(() => onUpdate({ ...update, index: parseInt(value) }), 500);
    }, [index]);

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
                <TextInput className='text-input-container' placeholder='Index' value={index.toString()} onChange={onTextChange} />
                <Button size={Button.Sizes.SMALL} onClick={() => move(1)} color={Button.Colors.BRAND_NEW}>▶</Button>
            </div>
        </div>
    )
}