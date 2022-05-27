import { classNames, React } from 'discordium';
import Discord from 'danho-discordium/components/Discord';
import { useMemoedState } from 'danho-discordium/hooks';

import { User } from '@discord';
import ZLibrary from '@ZLibrary';
import BDFDB from '@BDFDB';

import { BadgeData, SettingsUser } from '../../Settings/types';
import DefaultIcon from '../DefaultIcon';
import SettingsBadge from './SettingsBadge';
import SettingsBadgeList from './SettingsBadgeList';
import useSelectedBadge from './useSelectedBadge';

const { useMemo, useCallback, useEffect, useState } = React;
const {
    Avatar: { default: Avatar, Sizes },
    DiscordTag,
    Form: { FormItem },
    Margins, ClassModules
} = Discord;

type SettingsUserProps = {
    BDFDB: BDFDB,
    userId: string,
    data: SettingsUser,
    onSave: (badges: Array<BadgeData>) => void,
    addBadge: () => void,
    deleteUser: () => void
}

export default function SettingsUser({ BDFDB, userId, data, onSave, addBadge, deleteUser }: SettingsUserProps) {
    const { badges } = data;
    const user = useMemo(() => ZLibrary.DiscordModules.UserStore.getUser(userId) ?? {
        username: 'Unknown',
        avatar: <DefaultIcon />,
        get tag() { return "Unknown#0000"; }
    }, [userId]);
    const [selectedBadge, setSelectedBadge] = useSelectedBadge(badges);
    const { AccountDetails, Titles, UserProfileHeader } = ClassModules;

    const onBadgeClicked = useCallback((badge: BadgeData) => {
        return setSelectedBadge(badge === selectedBadge ? null : badge);
    }, [selectedBadge, data]);
    const onSelecetedBadgeUpdate = useCallback((badge: BadgeData) => {
        BdApi.showToast("Badge updated", { type: 'info' });
        onSave(badges.map((b, i) => i === selectedBadge.index ? badge : b));
    }, [selectedBadge, data, onSave]);
    const onSelectedBadgeDelete = useCallback(() => {
        const newBadges = [...badges];
        newBadges.splice(selectedBadge.index, 1);
        setSelectedBadge(b => badges[b.index - 1] ?? badges[badges.length - 1]);

        newBadges.length === 0 ? deleteUser() : onSave(newBadges);
    }, [data, onSave, selectedBadge]);

    return (
        <FormItem data-setting-for={userId} className={classNames(Margins.marginBottom20, 'settings-user')}>
            <div className="user-presentation">
                <figure className={classNames(AccountDetails.avatarWrapper, 'avatar')}>
                    <Avatar src={BDFDB.UserUtils.getAvatar(userId)} className={classNames(AccountDetails.avatar, 'avatar')} size={Sizes.SIZE_56} />
                </figure>
                <DiscordTag user={user as User} className={classNames(Titles.h1, AccountDetails.nameTag, Titles.defaultColor)} discriminatorClassName={UserProfileHeader.discriminator} />
                <SettingsBadgeList BDFDB={BDFDB} user={user as User} data={data}
                    onAddBadgeClick={addBadge}
                    onBadgeClick={onBadgeClicked}
                />
            </div>
            {selectedBadge && <SettingsBadge badge={selectedBadge} user={user as User} length={badges.length}
                onUpdate={onSelecetedBadgeUpdate}
                onDelete={onSelectedBadgeDelete}
            />}
        </FormItem>
    )
}