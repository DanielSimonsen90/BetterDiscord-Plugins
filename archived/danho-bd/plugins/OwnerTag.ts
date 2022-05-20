import { User, Guild, PermissionString, DiscordPermissionStrings } from '@discord';
import { Setting } from "danho-bd/base";

export class ExtraTag {
    constructor(id: string, guildID: string, type: number) {
        this.id = id;
        this.guildID = guildID
        this.type = type;
    }

    public id: string
    public guildID: string
    public type: number
}
export class InnerSetting<T = any> extends Setting<T> {
    constructor(value: T, public inner: boolean, description: string) {
        super(value, description)
    }
}

export enum userTypes {
    NONE,
    MANAGEMENT,
    MODERATOR,
    SRMOD,
    ADMIN,
    OWNER,
    CREATOR,
    CUSTOM
}

const MoreTags = {
    Marcus: new ExtraTag('285853150794219520', '384299534819262474', userTypes.OWNER),
    Maria: new ExtraTag('357534185604251650', '405763731079823380', userTypes.CREATOR),
    Danho: new ExtraTag('245572699894710272', '248104299534614528', userTypes.CREATOR),

    is(user: User, guild: Guild, type: number) {
        for (var propertyString in this) {
            const prop = this[propertyString];
            if (propertyString == 'is') return false;
            if (user.id == prop.id && guild.id == prop.guildID && type == prop.type) return true;
        }
    }
};



class OwnerTagPermissions {
    constructor(BDFDB, custom: {}) {
        this.permissions = {
            all: Object.keys(DiscordPermissionStrings) as Array<PermissionString>,
            manager: [
                'MANAGE_CHANNELS',
                'MANAGE_GUILD_EXPRESSIONS',
                'MANAGE_MESSAGES',
                'MANAGE_NICKNAMES',
                'MANAGE_ROLES',
                'MANAGE_GUILD'
            ],
            moderator: [
                'KICK_MEMBERS',
                'BAN_MEMBERS',
                'MUTE_MEMBERS',
                'DEAFEN_MEMBERS',
                'MOVE_MEMBERS'
            ],
            custom: Object.keys(custom).filter(prop => 
                prop != "tagName" && 
                !prop.startsWith("Title") && 
                custom[prop] === true
            ) as Array<PermissionString>
        }
        this.can = (permission: string, user: User) => BDFDB.UserUtils.can(permission, user.id);
    }

    permissions: {
        all: Array<PermissionString>,
        manager: Array<PermissionString>,
        moderator: Array<PermissionString>,
        custom: Array<PermissionString>,
    }
    can(permission: string, user: User) {
        return false;
    }
    
    get(permissionType: string[], user: User): string[]  {
        return permissionType.map(perm => this.can(perm, user) && this.permissions.all[perm]).filter(v => v);
    }
    getSrMod(user: User, guild: Guild): string[] {
        if (this.can('ADMINISTRATOR', user)) return null;

        const cantDo = this.permissions.all.filter(perm => !this.can(perm, user));
        const removedStrings = new Array<string>();
        const viewAnalytics = 'VIEW_GUILD_ANALYTICS';

        if (guild && !guild.features.has("COMMUNITY") && cantDo.includes(viewAnalytics)) {
            cantDo.splice(cantDo.indexOf(viewAnalytics), 1);
            removedStrings.push(`${this.permissions.all[viewAnalytics]} (guild is not community)`);
        }

        const unnecessary = [
            'ADMINISTRATOR', 
            'MANAGE_WEBHOOKS', 
            'PRIORITY_SPEAKER', 
            'SEND_TTS_MESSAGES'
        ];

        if (cantDo.length > 5) {
            for (let i = 0; cantDo.length <= 5; i++) {
                const perm = unnecessary[i] as PermissionString;
                
                if (cantDo.includes(perm)) {
                    cantDo.splice(cantDo.indexOf(perm));
                    removedStrings.push(perm);
                }
                
                if (i >= unnecessary.length) break;
            }
        }

        if (removedStrings.length && cantDo.length < 6)
            console.log(`%c[%cOwnerTag: %cDanho%c] %c[%c${user.username}%c]%c: %cRemoved: [%c${removedStrings.join(", ")}%c]`,
            "color:dodgerblue", "color:cornflowerblue", "color:orange", "color:dodgerblue", //[OwnerTag: Danho]
            "color:silver", "color:white", "color:silver", "color:white", //[user.username]:
            "color:#ffff4d", "color:#ffff99", "color:#ffff4d"); //Removed [<perms>] 
        return cantDo.length < 6 && cantDo;
    }
}

export { MoreTags, OwnerTagPermissions };