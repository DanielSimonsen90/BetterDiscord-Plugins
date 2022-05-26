import { React, Finder } from 'discordium';
import { User } from '@discord';
import Discord from 'danho-discordium/components/Discord';
import Badge from '../Badge';
import PlusIcon from './PlusIcon';
import BDFDB from '@BDFDB';
import $ from '@dquery';
import ZLibrary from '@ZLibrary';

const { UserProfileBadgeList, ClassModules } = Discord;
const { default: BadgeList } = UserProfileBadgeList;
const { useEffect, createRef } = React;

type SettingsBadgeListProps = {
    user: User,
    data: {
        premiumSince?: string | null,
        boosterSince?: string | null,
    },

    onBadgeClick: (index: number) => void,
    onAddBadgeClick: () => void,
}

// ZLibrary.DiscordModules.UserStore.getUser("682208707119022102").flags << BDD.findModule(["UserFlags"]).UserFlags.HYPESQUAD

let patched = false;
export default function SettingsBadgeList({ user, data: { premiumSince, boosterSince }, onBadgeClick, onAddBadgeClick }: SettingsBadgeListProps) {
    const ref = createRef<HTMLDivElement>();

    useEffect(() => {
        if (patched || !ref.current) return;

        const badgeList = $(ref.current).children(null, true);
        const badgeElements = badgeList.children();
        if (!badgeElements.some(badge => badge.fiber.memoizedProps.tooltipText === "Add badge")) {
            badgeElements.forEach((badge, i) => {
                badge.fiber.memoizedProps.onClick = badge.classes.includes("danho-badge") ? () => onBadgeClick(i) : null;
                return badge;
            });
            badgeList.appendComponent(<Badge BDFDB={BDFDB} src={<PlusIcon />} tooltipText="Add badge" onClick={onAddBadgeClick} />);
        }
    }, [])

    return (
        <div className="settings-badge-list" ref={ref}>
            {/* <BadgeList user={user as User}
                className={ClassModules.UserModal.container}
                premiumSince={premiumSince ? new Date(premiumSince) : null}
                premiumGuildSince={boosterSince ? new Date(boosterSince) : null}
            /> */}
        </div>
    )
}