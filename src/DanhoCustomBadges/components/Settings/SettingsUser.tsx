import { User } from '@discord';
import BDFDB from '@BDFDB';

import { BadgeData, SettingsUser } from '../../Settings/types';
import DefaultIcon from '../DefaultIcon';
import SettingsBadge from './SettingsBadge';
import SettingsBadgeList from './SettingsBadgeList';
import useSelectedBadge from './useSelectedBadge';

const { Libraries, Modules } = window.BDD;
const { ZLibrary } = Libraries;
const { React, CompiledReact } = Modules;
const { useMemo, useCallback } = React;
const { classNames, Components } = CompiledReact;
const {
    Avatar: { default: Avatar, Sizes },
    DiscordTag,
    Form: { FormItem },
    Margins, ClassModules
} = Components;


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
        return setSelectedBadge(selectedBadge && badge.id === selectedBadge.id ? null : badge);
    }, [selectedBadge, data]);
    const onBadgeUpdate = useCallback((badge: BadgeData) => {
        BdApi.showToast("Badge updated", { type: 'info' });
        const newBadges = badges.map(b => b.id === selectedBadge.id ? badge : b);
        console.log('Saving new badges', newBadges);
        onSave(newBadges);
        setSelectedBadge(undefined);
    }, [selectedBadge, data, onSave]);
    const onBadgeDelete = useCallback(() => {
        const newBadges = [...badges];
        newBadges.splice(newBadges.findIndex(b => b.id === selectedBadge.id), 1);
        setSelectedBadge(b => (b && badges[b.index - 1]) ?? badges[badges.length - 1]);

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
            {selectedBadge && <SettingsBadge badge={selectedBadge} user={user as User}
                onUpdate={onBadgeUpdate}
                onDelete={onBadgeDelete}
            />}
        </FormItem>
    )
}