import { createDiumStore, DanhoStores } from "@stores";
import { BadgeTypes } from "@discord/components";
import { CustomBadgeData } from "../CustomBadge";
import { USER_TAGS } from "src/0DanhoLibrary/constants";

const CustomBadgesStore = createDiumStore<Record<string, CustomBadgeData>>({
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
    userTags: [USER_TAGS.DANHO],
    position: 0,
    size: '16px',
    href: 'https://open.spotify.com/artist/2Ya69OwtcUqvAMPaE8vXdg?si=ELamxrqgR-KLZwTqYA6AXA'
  },
  mose_clan: {
    name: 'Mose Clan',
    iconUrl: 'https://imgur.com/Wm1pEfY.png',
    userTags: [USER_TAGS.DANHO, USER_TAGS.THEGUNASS, USER_TAGS.BEAUTYKILLER, USER_TAGS.EMILIE, USER_TAGS.CARL],
    size: '24px',
    position: 1
  }
}, 'CustomBadges');

DanhoStores.register(CustomBadgesStore);

export default CustomBadgesStore;