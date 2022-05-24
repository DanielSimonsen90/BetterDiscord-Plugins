import { React, Modules, classNames } from 'discordium';

import ZLibrary from '@ZLibrary';
import BDFDB from '@BDFDB';

import DefaultIcon from '../DefaultIcon';
import Badge from '../Badge';
import { BadgeData } from '../../Settings/types';
import PlusIcon from './PlusIcon';
import SettingsBadge from './SettingsBadge';
import { User } from '@discord';

const { useMemo, useState, useCallback, useEffect } = React;
const { margins, Button, TextInput } = Modules;
const { FormItem } = Modules.Form;

type SettingsUserProps = {
    BDFDB: BDFDB,
    userId: string,
    badges: Array<BadgeData>,
    onSave: (badges: Array<BadgeData>) => void,
    addBadge: () => void,
    deleteUser: () => void
}

export default function SettingsUser({ BDFDB, userId, badges, onSave, addBadge, deleteUser }: SettingsUserProps) {
    const user = useMemo(() => ZLibrary.DiscordModules.UserStore.getUser(userId) ?? {
        username: 'Unknown',
        avatar: <DefaultIcon />,
        get tag() { return "Unknown#0000"; }
    }, [userId]);
    const [selectedBadgeIndex, setSelectedBadgeIndex] = useState(-1);
    const selectedBadge = useMemo(() => badges[selectedBadgeIndex], [selectedBadgeIndex, badges]);
    const { Titles, AccountDetails } = ZLibrary.DiscordClassModules;

    const onSelecetedBadgeUpdate = useCallback((badge: BadgeData) => {
        BdApi.showToast("Badge updated", { type: 'info' });
        onSave(badges.map((b, i) => i === selectedBadgeIndex ? badge : b));
    }, [selectedBadgeIndex, badges, onSave]);
    const onSelectedBadgeDelete = useCallback(() => {
        const newBadges = [...badges];
        newBadges.splice(selectedBadgeIndex, 1);
        setSelectedBadgeIndex(i => i - 1);
        onSave(newBadges);
    }, [badges, onSave, selectedBadgeIndex]);

    return (
        <FormItem data-setting-for={userId} className={classNames(margins.marginBottom20, 'settings-user')}>
            <div className="user-presentation">
                <div className={classNames(AccountDetails.avatarWrapper, 'avatar')}>
                    {typeof user.avatar === 'string' ? <img src={BDFDB.UserUtils.getAvatar(userId)} className={AccountDetails.avatar} /> : user.avatar}
                </div>
                <div className="tag">
                    <h1 className={classNames(Titles.h1, AccountDetails.nameTag, Titles.defaultColor)}>{user.tag}</h1>
                    <Button className='delete' borderColor={Button.Colors.RED} look={Button.Looks.OUTLINED} size={Button.Sizes.TINY} onClick={deleteUser}>Delete</Button>
                </div>
                {/* <BadgeList user={user as User} className={ZLibrary.DiscordClassModules.UserModal.container} premiumSince={null} /> */}
                <div className="badgeList">
                    {badges.sort((a, b) => b.index - a.index).map((badge, i) => (
                        <Badge BDFDB={BDFDB} src={badge.src} tooltipText={badge.tooltip} onClick={() => setSelectedBadgeIndex(i)} key={badge.src} />
                    ))}
                    <Badge BDFDB={BDFDB} src={<PlusIcon />} tooltipText="Add badge" onClick={addBadge} />
                </div>
            </div>
            {selectedBadge && <SettingsBadge badge={selectedBadge} user={user as User} length={badges.length} onUpdate={onSelecetedBadgeUpdate} onDelete={onSelectedBadgeDelete} />}
        </FormItem>
    )
}