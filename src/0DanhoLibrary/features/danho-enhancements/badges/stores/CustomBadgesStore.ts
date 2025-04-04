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
      name: 'Daniel Simonsen himself',
      iconUrl: 'https://imgur.com/jva0EMf.png',
      userTags: [
        // USER_TAGS.DANHO
      ],
      position: 0,
      size: '16px',
      href: 'https://open.spotify.com/artist/2Ya69OwtcUqvAMPaE8vXdg?si=ELamxrqgR-KLZwTqYA6AXA'
    },
    mose_clan: {
      name: 'Mose Clan',
      iconUrl: 'https://imgur.com/Wm1pEfY.png',
      userTags: [USER_TAGS.DANHO, USER_TAGS.THEGUNASS, USER_TAGS.BEAUTYKILLER, USER_TAGS.EMILIE, USER_TAGS.CARL],
      size: '24px',
      position: 0
    },
    silly_goose: {
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
      this.update(current => ({
        ...current,
        customBadges: DEFAULT_STATE.customBadges,
      }))
    });
  }
}

DanhoStores.register(CustomBadgesStore);

export default CustomBadgesStore;