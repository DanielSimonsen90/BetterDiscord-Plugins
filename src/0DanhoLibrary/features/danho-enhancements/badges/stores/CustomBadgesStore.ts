import { BadgeTypes } from "@discord/components";
import { Snowflake } from "@discord/types";
import { DanhoStores, DiumStore } from "@stores";

import { CustomBadgeData } from "../components/CustomBadge";
import { USER_TAGS } from "src/0DanhoLibrary/constants";

type State = {
  customBadges: Record<string, CustomBadgeData>;
  users: Record<Snowflake, Array<string>>;
}

const DEFAULT_STATE: State = {
  customBadges: {
    developer: {
      id: 'developer',
      name: 'Plugin Developer',
      iconUrl: 'https://i.imgur.com/f5MDiAd.png',
      userTags: [USER_TAGS.DANHO],
      position: {
        before: BadgeTypes.ACTIVE_DEVELOPER,
        default: 0
      },
      size: '14px',
      href: 'https://github.com/DanielSimonsen90'
    },
    daniel_simonsen: {
      id: 'daniel_simonsen',
      name: 'Daniel Simonsen himself',
      iconUrl: 'https://imgur.com/jva0EMf.png',
      userTags: [USER_TAGS.DANHO],
      position: 'start',
      size: '16px',
      href: 'https://open.spotify.com/artist/2Ya69OwtcUqvAMPaE8vXdg?si=ELamxrqgR-KLZwTqYA6AXA'
    },
    mose_clan: {
      id: 'mose_clan',
      name: 'Mose Clan',
      iconUrl: 'https://imgur.com/Wm1pEfY.png',
      userTags: [USER_TAGS.DANHO, USER_TAGS.THEGUNASS, USER_TAGS.BEAUTYKILLER, USER_TAGS.EMILIE, USER_TAGS.CARL],
      size: '24px',
      position: {
        after: 'daniel_simonsen',
      }
    },
    silly_goose: {
      id: 'silly_goose',
      name: 'Silly Goose',
      iconUrl: 'https://i.imgur.com/5waDSil.png',
      userTags: [USER_TAGS.MIZBATT],
    }
  } as Record<string, CustomBadgeData>,

  users: {} as Record<Snowflake, Array<string>>
}

export const CustomBadgesStore = new class CustomBadgesStore extends DiumStore<State> {
  constructor() {
    super(DEFAULT_STATE, 'CustomBadgesStore', () => {
      // this.resetCustomBadges();
      this.removeEmptyUsers();
    });
  }

  public get customBadges() {
    return Object.values(this.current.customBadges);
  }

  public updateCustomBadge(badge: CustomBadgeData) {
    this.update(current => ({
      ...current,
      customBadges: {
        ...current.customBadges,
        [badge.id]: badge
      }
    }));
  }
  public deleteCustomBadge(badgeId: string) {
    this.update(current => {
      const { [badgeId]: _, ...rest } = current.customBadges;
      return {
        ...current,
        customBadges: rest
      };
    });
  }

  public updateCustomUser(userId: Snowflake, badgeId: string) {
    this.update(current => ({
      ...current,
      users: {
        ...current.users,
        [userId]: [...(current.users[userId] || []), badgeId]
      }
    }));
  }

  private resetCustomBadges() {
    this.update(current => ({
      ...current,
      customBadges: DEFAULT_STATE.customBadges,
    }));
  }
  private removeEmptyUsers() {
    const emptyUsers = Object
      .entries(this.current.users)
      .filter(([userId, badges]) => !badges.length)
      .map(([userId]) => userId);

    if (emptyUsers.length) {
      this.update(current => ({
        ...current,
        users: Object.fromEntries(Object.entries(current.users).filter(([userId]) => !emptyUsers.includes(userId))),
      }));
    }
  }
}

DanhoStores.register(CustomBadgesStore);

export default CustomBadgesStore;