import { classNames, React } from 'discordium';
import Discord from 'danho-discordium/components/Discord';
import { useMemoedState, usePatcher } from 'danho-discordium/hooks';

import { User } from '@discord';
import ZLibrary from '@ZLibrary';
import BDFDB from '@BDFDB';

import config from '../../config.json'
import { BadgeData, SettingsUser } from '../../Settings/types';
import Badge from '../Badge';
import DefaultIcon from '../DefaultIcon';
import SettingsBadge from './SettingsBadge';
import PlusIcon from './PlusIcon';
import { createPatcher, createLogger } from '@discordium/api';
import SettingsBadgeList from './SettingsBadgeList';

const { useMemo, useCallback, useEffect, useState } = React;
const {
    Avatar: { default: Avatar, Sizes },
    DiscordTag,
    UserProfileBadgeList,
    Form: { FormItem },
    Margins, ClassModules
} = Discord;
const { default: BadgeList } = UserProfileBadgeList

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
    const [selectedBadge, setSelectedBadgeIndex, selectedBadgeIndex] = useMemoedState(-1, index => data[index], [data])
    const { AccountDetails, Titles, UserProfileHeader } = ClassModules;

    const onSelecetedBadgeUpdate = useCallback((badge: BadgeData) => {
        BdApi.showToast("Badge updated", { type: 'info' });
        onSave(badges.map((b, i) => i === selectedBadgeIndex ? badge : b));
    }, [selectedBadgeIndex, data, onSave]);
    const onSelectedBadgeDelete = useCallback(() => {
        const newBadges = [...badges];
        newBadges.splice(selectedBadgeIndex, 1);
        setSelectedBadgeIndex(i => i - 1);

        newBadges.length === 0 ? deleteUser() : onSave(newBadges);
    }, [data, onSave, selectedBadgeIndex]);

    return (
        <FormItem data-setting-for={userId} className={classNames(Margins.marginBottom20, 'settings-user')}>
            <div className="user-presentation">
                <figure className={classNames(AccountDetails.avatarWrapper, 'avatar')}>
                    <Avatar src={BDFDB.UserUtils.getAvatar(userId)} className={classNames(AccountDetails.avatar, 'avatar')} size={Sizes.SIZE_56} />
                </figure>
                <DiscordTag user={user as User} className={classNames(Titles.h1, AccountDetails.nameTag, Titles.defaultColor)} discriminatorClassName={UserProfileHeader.discriminator} />
                <SettingsBadgeList user={user as User} data={data} onAddBadgeClick={addBadge} onBadgeClick={i => (
                    i === selectedBadgeIndex ? setSelectedBadgeIndex(-1) : setSelectedBadgeIndex(i)
                )} />
                {/* <div className="badgeList">
                    {badges.sort((a, b) => b.index - a.index).map((badge, i) => (
                        <Badge BDFDB={BDFDB} src={badge.src} tooltipText={badge.tooltip} onClick={() => {
                            i === selectedBadgeIndex ? setSelectedBadgeIndex(-1) : setSelectedBadgeIndex(i)
                        }} key={badge.src} />
                    ))}
                </div> */}
            </div>
            {selectedBadge && <SettingsBadge badge={selectedBadge} user={user as User} length={badges.length}
                onUpdate={onSelecetedBadgeUpdate}
                onDelete={onSelectedBadgeDelete}
            />}
        </FormItem>
    )
}