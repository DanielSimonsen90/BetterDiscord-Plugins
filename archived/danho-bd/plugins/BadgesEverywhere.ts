import { Item } from "danho-bd/base";

//#region Classes
export class DreamUser extends Item {
    constructor(id: string, name: string, badges: Badge[]) {
        super({ id, name });
        this.badges = badges;
    }

    public badges: Badge[]
}
export class Badge {
    constructor(id: string, value?: boolean) {
        this.id = id;
        this.value = value;
    }

    public id: string
    public value: boolean | BadgeValue
}                                                 //Normal Badge
export class ClickBadge extends Badge {
    constructor(id: string, value?: boolean, link?: string) {
        super(id, value);
        this.link = link;
    }
    public link: string
    public setLink(link: string) {
        switch (this.id) {
            case BadgesToUnderstand.Partner.id: link = `https://discord.gg/${link}`; break;
            case BadgesToUnderstand.EarlyBotDev.id: link = `https://discord.com/api/oauth2/authorize?${link}`; break;
            default: console.warn(`[DanhoLibrary] [ClickBadge.setLink] ${this.id} was not recognized!`); break;
        }
        return new ClickBadge(this.id, this.value as boolean, link);
    }
}                              //Badge with link
export class CustomBadge extends Badge {
    constructor(id: string, value?: boolean) {
        super(id, value)
    }
}                             //Custom Badge
export class CustomClickBadge extends ClickBadge {
    constructor(id: string, value?: boolean, link?: string) {
        super(id, value, link)
    }

    public setLink(link: string) {
        switch (this.id) {
            case BadgesToUnderstand.VerifiedServerOwner.id: link = `https://discord.gg/${link}`; break;
            default: console.warn(`[DanhoLibrary] [ClickBadge.setLink] ${this.id} was not recognized!`); break;
        }
        return new CustomClickBadge(this.id, this.value as boolean, link);
    }
}                   //Custom Badge with link
export class CustomSpecificBadge extends CustomBadge {
    constructor(id: string, assignedTo?: DreamUser[]) {
        super(id, false);
        this.assignedTo = assignedTo || "";
    }
    public assignedTo: DreamUser[] | string

    public setValue(HTMLID: string, toolTip: string) {
        this.value = new BadgeValue(HTMLID, getToolTip(this, toolTip));
        return this;

        function getToolTip(sBadge: CustomSpecificBadge, start: string) {
            return start += sBadge.assignedTo.length > 1 ?
                ` ${(sBadge.assignedTo[0] as DreamUser).name} & ${(sBadge.assignedTo[1] as DreamUser).name}` :
                ' ' + (sBadge.assignedTo[0] as DreamUser).name
        }
    }
}               //Custom Badge with user specific names
export class CustomSpecificClickBadge extends CustomSpecificBadge {
    constructor(id: string, assignedTo?: DreamUser[] | string, link?: string) {
        super(id, assignedTo as DreamUser[]);
        this.link = link;
    }
    public link: string
    public setLink(link: string) {
        switch (this.id) {
            case BadgesToUnderstand.BotDeveloper.id: link = `https://discord.com/api/oauth2/authorize?${link}`; break;
            default: console.warn(`[DanhoLibrary] [ClickBadge.setLink] ${this.id} was not recognized!`); break;
        }
        return new CustomSpecificClickBadge(this.id, this.assignedTo, link);
    }
}  //Custom Badge with user specific names & link
class BadgeValue extends CustomBadge {
    constructor(HTMLID: string, toolTip: string) {
        super(HTMLID, true);
        this.name = toolTip;
        this.icon = "profileCustomBadge";
        this.size = 17;
    }

    public name: string
    public icon: string
    public size: number
}                               //Value for Custom Badges

export class BotDeveloper extends Item {
    constructor(id: string, name: string) {
        super({ id, name });
    }
}
export class Bot extends BotDeveloper {
    constructor(id: string, name: string, creators: BotDeveloper[]) {
        super(id, name);
        this.assignedTo = creators;
    }

    public assignedTo: BotDeveloper[]
}
export class Invite {
    constructor(user: DreamUser, link: string) {
        this.user = user;
        this.link = link;
    }

    public user: DreamUser
    public link: string
}

export class TimeSpan {
    constructor(date: Date) {
        this.milliseconds = Date.now() - date.getTime();
    }

    public milliseconds: number
    public toDate() {
        var now = new Date(Date.now());
        var currentMonthDays = [1, 3, 5, 7, 8, 10, 12].includes(now.getMonth()) ? 31 : [4, 6, 9, 11].includes(now.getMonth()) ? 30 : 28;

        var days = Math.floor((this.milliseconds / (1000 * 60 * 60 * 24)));
        if (days > 365.25) days /= 365.25;
        else if (days > currentMonthDays) days /= currentMonthDays;

        var months = Math.floor(this.milliseconds / (1000 * 60 * 60 * 24 * currentMonthDays));
        var years = Math.floor((this.milliseconds / (1000 * 60 * 60 * 24 * 365.25)));
        return { days, months, years }
    }
}
//#endregion

export const BadgesToUnderstand = {
    /*==: Official Badges :==*/
    /*[0]*/Staff: new Badge('1'),
    /*[1]*/Partner: new ClickBadge('2'),
    /*[2]*/HSEvents: new Badge('4'),
    /*[3]*/BugHunterGreen: new Badge('8'),
    /*[4]*/HSBravery: new Badge('64'),
    /*[5]*/HSBrilliance: new Badge('128'),
    /*[6]*/HSBalance: new Badge('256'),
    /*[7]*/EarlySupporter: new Badge('512'),
           TeamUser: new Badge('1024'),
    /*[8]*/BugHunterGold: new Badge('16384'),
    /*[9]*/EarlyBotDev: new ClickBadge('131072'),
    /*[10]*/Moderator: new Badge('262144'),
    /*[11]*/ServerBoost: new Badge('524288'),

    /*==: Custom Badges :==*/
    /*[12]*/CustomBadge: new CustomClickBadge('9999999'),
    /*[13]*/PinguDev: new CustomClickBadge('5684'),
    /*[14]*/NitroGifter: new CustomSpecificBadge('262143'),
    /*[15]*/BotDeveloper: new CustomSpecificClickBadge('131071'),
    /*[16]*/VerifiedBot: new CustomSpecificBadge('131070'),
    /*[17]*/VerifiedServerOwner: new CustomClickBadge('3'),
};
export const CustomBadges = [
    BadgesToUnderstand.CustomBadge,
    BadgesToUnderstand.PinguDev,
    BadgesToUnderstand.BotDeveloper,
    BadgesToUnderstand.NitroGifter,
    BadgesToUnderstand.VerifiedServerOwner,
    BadgesToUnderstand.VerifiedBot
];
export const DreamUsers = {
    /*==: Users :==*/
    Andy: new DreamUser('272091815161757697', 'AndreasFraDK', []),
    Danho: new DreamUser('245572699894710272', "Danho", [
        BadgesToUnderstand.Partner.setLink('uvgbjX2fEH'),
        BadgesToUnderstand.VerifiedServerOwner.setLink('gbxRV4Ekvh'),
        BadgesToUnderstand.PinguDev,
        BadgesToUnderstand.NitroGifter
    ]),
    Emma: new DreamUser('361815289278627851', "Emsenparry", []),
    FrostInvoker: new DreamUser('303060468912619520', 'FrostInvoker', []),
    GibStorm: new DreamUser('176797394585780224', "GibStorm", [
        BadgesToUnderstand.Partner.setLink('https://discord.dk/')
    ]),
    HankBoone: new DreamUser('532854771946749962', 'HankBoone', [
        BadgesToUnderstand.BotDeveloper.setLink('client_id=794099208411283457&permissions=335543414&scope=bot'),
        BadgesToUnderstand.EarlyBotDev
    ]),
    MorphactZ: new DreamUser('277361003950505984', "MorphactZ", [
        BadgesToUnderstand.Partner.setLink('gEsfAZS4af'),
    ]),
    Maria: new DreamUser('357534185604251650', "Мариа", []),
    MrRobot: new DreamUser('190440734510415873', "Mr. Robot", [
        BadgesToUnderstand.BotDeveloper
    ]),
    Noodle: new DreamUser('173577749330526208', "Noodle", [
        BadgesToUnderstand.BotDeveloper
    ]),
    Kid: new DreamUser('324191949353385984', "Kid", [
        BadgesToUnderstand.BotDeveloper,
        BadgesToUnderstand.NitroGifter
    ]),
    Krusid: new DreamUser('131821122562818049', "Llama Krusid", [
        BadgesToUnderstand.BotDeveloper
    ]),
    Nikolai: new DreamUser('607825289371844610', "Nikolai Jensen", [
        BadgesToUnderstand.BotDeveloper
    ]),
    Panther: new DreamUser('328673639237025792', "Panther", []),
    Rina: new DreamUser('343021359770763265', "Rina", [
        BadgesToUnderstand.Partner.setLink('danskegamers')
    ]),
    Slothman: new DreamUser('290131910091603968', "Slothman", [
        BadgesToUnderstand.BotDeveloper,
        BadgesToUnderstand.PinguDev
    ]),
    SlothSlave: new DreamUser('803903863706484756', "SlothSlave", [
        BadgesToUnderstand.PinguDev,
        BadgesToUnderstand.BugHunterGreen
    ]),
    Simpieoso: new DreamUser('526576776391032891', 'Simpieoso', [
        BadgesToUnderstand.BotDeveloper
    ]),
    Squ1dz: new DreamUser('166952105662218240', "Squ1dz", []),
    SynthySytro: new DreamUser('405331883157880846', "Synthy Sytro", [
        BadgesToUnderstand.BugHunterGold,
        BadgesToUnderstand.PinguDev
    ]),
    Waterslide56: new DreamUser('396357904950755338', "Waterslide56", [
        BadgesToUnderstand.VerifiedServerOwner.setLink('guaeKGkbKA'),
        BadgesToUnderstand.BotDeveloper.setLink('client_id=769355873549025320&permissions=8&scope=bot'),
    ]),
    Zaint: new DreamUser('139729954471542784', "Zaint1311", [
        BadgesToUnderstand.NitroGifter
    ]),

    /*==: Bots :==*/
    AnimeKanna: new DreamUser('778776695376576583', "Anime Kanna", [BadgesToUnderstand.BotDeveloper]),
    AnimeSenku: new DreamUser('778832842653564929', "Anime Senku", [BadgesToUnderstand.BotDeveloper]),
    Billette: new DreamUser('643396163633938452', "Billette", [BadgesToUnderstand.BotDeveloper]),
    Carlo: new DreamUser('653848342526296066', "Carlo", [BadgesToUnderstand.BotDeveloper]),
    NordBot: new DreamUser('794099208411283457', "NordBot", [
        BadgesToUnderstand.BotDeveloper
    ]),
    Ordis: new DreamUser('649881939498631179', "Ordis", [BadgesToUnderstand.BotDeveloper]),
    Pingu: new DreamUser('562176550674366464', "Pingu", [
        BadgesToUnderstand.PinguDev,
        //BadgesToUnderstand.VerifiedBot
    ]),
    PinguBeta: new DreamUser('778288722055659520', "Pingu Beta", [BadgesToUnderstand.PinguDev]),
    Reboot: new DreamUser('778064317169401906', "Reboot", [BadgesToUnderstand.BotDeveloper]),
    Shinboo: new DreamUser('779226161359618059', "Shinboo", [BadgesToUnderstand.BotDeveloper]),
    Slothbot: new DreamUser('641995454279581740', "Slothbot", [BadgesToUnderstand.BotDeveloper]),
    Waterbottle: new DreamUser('769355873549025320', "Waterbottle", [BadgesToUnderstand.BotDeveloper]),

    /*==: Others :==*/
    Ahrix: new DreamUser('292682639700394014', "Ahrix", [
        BadgesToUnderstand.Partner.setLink('NDvGpw3')
    ]), //Owns Ahrix's Hideout
    Animetic: new DreamUser('270595971899981826', "Animetic", [
        BadgesToUnderstand.Partner.setLink('animetic')
    ]), //Owns Animetic's Discord
    Anis: new DreamUser('138362511190786048', "Anis", [
        BadgesToUnderstand.VerifiedServerOwner.setLink('mee6'),
        BadgesToUnderstand.EarlyBotDev.setLink('scope=bot&response_type=code&redirect_uri=https%3A%2F%2Fmee6.xyz%2Fguild-oauth&permissions=1916267615&client_id=159985415099514880&guild_id=644823098260062221')
    ]), //Owns MEE6
    brettph: new DreamUser('393131822642495490', "brettph", [
        BadgesToUnderstand.VerifiedServerOwner.setLink('pornhub')
    ]), //Owns Pornhub
    ChilledCow: new DreamUser('707959738486489200', "ChilledCow", [
        BadgesToUnderstand.VerifiedServerOwner.setLink('chilledcow')
    ]), //Owns ChilledCow
    Dray: new DreamUser('164564849915985922', "Dray", [
        BadgesToUnderstand.Partner.setLink('overwatch')
    ]), //Owns r/Overwatch
    ERIK: new DreamUser('506396083165855744', "ERIK", [
        BadgesToUnderstand.EarlyBotDev.setLink('client_id=550613223733329920&permissions=1342532688&scope=bot')
    ]), //Owns ReactionRoles
    Eskay: new DreamUser('175339512367546368', "Eskay", [
        BadgesToUnderstand.Partner.setLink('eskay')
    ]), //Owns Eskay's Skating Rink
    Hammy: new DreamUser('148892830658461696', "Hammy", [
        BadgesToUnderstand.Partner.setLink('memes')
    ]), //Owns Memeoligy
    HeadHunterz: new DreamUser('783962113869086751', "HeadHunterz", [
        BadgesToUnderstand.VerifiedServerOwner.setLink('headhunterz')
    ]), //Owns HeadHunterz
    Igno: new DreamUser('117720916179288066', "Igno", [
        BadgesToUnderstand.Partner.setLink('hardstyle')
    ]), //Owns r/hardstyle
    ImBursting: new DreamUser('166179284266778624', "ImBursting", [
        BadgesToUnderstand.EarlyBotDev.setLink('client_id=235088799074484224&permissions=8&scope=bot&response_type=code&redirect_uri=https%3A%2F%2Frythmbot.co%2Fthanks')
    ]), //Owns Rythm
    Isi: new DreamUser('128162125511262208', 'Isi', [
        BadgesToUnderstand.VerifiedServerOwner.setLink(`pixelmon`)
    ]), //Owns Pixelmon Mod
    jagrosh: new DreamUser('113156185389092864', "jagrosh", [
        BadgesToUnderstand.VerifiedServerOwner.setLink('droplet'),
        BadgesToUnderstand.EarlyBotDev.setLink('permissions=347200&scope=bot&client_id=294882584201003009&redirect_uri=https%3A%2F%2Fgiveawaybot.party%2Fthanks&response_type=code'),
    ]), //Giveaway Bot Developer that doesn't have the Early Verified Developer Badge because he dumdum
    Jay3: new DreamUser('170324348312223744', "Jay3", [
        BadgesToUnderstand.VerifiedServerOwner.setLink('jay3')
    ]), //Owns Jay3
    JonasAden: new DreamUser('696760152040275979', "JonasAden", [
        BadgesToUnderstand.VerifiedServerOwner.setLink('jonasaden')
    ]), //Owns Jonas Aden Family
    Kenth: new DreamUser('384298827508613121', "Kenth", [
        BadgesToUnderstand.Partner.setLink('tweeka-family')
    ]), //Da Tweekaz Kenth
    MarcusDrJäger: new DreamUser('285853150794219520', "Marcus Dr. Jäger", [
        BadgesToUnderstand.Partner.setLink('tweeka-family')
    ]), //Da Tweekaz Marcus
    Mason: new DreamUser('53908232506183680', 'Mason', [
        BadgesToUnderstand.VerifiedServerOwner.setLink('discord-developers')
    ]), //Owns Discord Developers
    Melmsie: new DreamUser('172571295077105664', "Melmsie", [
        BadgesToUnderstand.EarlyBotDev.setLink('client_id=270904126974590976&scope=bot&permissions=-9&redirect_uri=https%3A%2F%2Fdankmemer.lol%2Flanding&response_type=code')
    ]), //Owns Dank Memer
    mL7: new DreamUser('187253910799515648', "mL7", [
        BadgesToUnderstand.Partner.setLink('mL7')
    ]), //Owns mL7's Chambers
    Nik: new DreamUser('117371014895239172', "Nik", [
        BadgesToUnderstand.EarlyBotDev.setLink('redirect_uri=http%3A%2F%2Fgroovy.bot%2Fcallback&response_type=code&scope=bot+identify+guilds+email&permissions=8&client_id=234395307759108106')
    ]), //Owns Groovy
    NoobLance: new DreamUser('155037590859284481', "NoobLance", [
        BadgesToUnderstand.EarlyBotDev.setLink('client_id=161660517914509312&scope=bot+identify+guilds&response_type=code&redirect_uri=https%3A%2F%2Fdyno.gg%2Freturn&permissions=2134207679'),
        BadgesToUnderstand.Partner.setLink('dyno')
    ]), //Owns Dyno
    quickblend: new DreamUser('73193882359173120', 'quickblend', [
        BadgesToUnderstand.VerifiedServerOwner.setLink('discord-townhall')
    ]), //Owns Discord Townhall
    sct: new DreamUser('42432475263139840', "sct", [
        BadgesToUnderstand.VerifiedServerOwner.setLink('technic')
    ]), //Owns Technic
    Solarion: new DreamUser('109343000785670144', "Solarion", [
        BadgesToUnderstand.VerifiedServerOwner.setLink('discord-testers')
    ]), //Owns Discord Testers
    technophønix: new DreamUser('111682132115509248', "technophønix", [
        BadgesToUnderstand.Partner.setLink('pokemon')
    ]), //Owns r/Pokemon
    TheDooo: new DreamUser('265986744019714050', "TheDooo", [
        BadgesToUnderstand.Partner.setLink('thedooo')
    ]), //Owns Dooocord
    Veld: new DreamUser('121919449996460033', "Veld", [
        BadgesToUnderstand.EarlyBotDev.setLink('client_id=160185389313818624&scope=bot&permissions=355593334')
    ]), //Owns Miki
    xQc: new DreamUser('195980608822837249', "xQc", [
        BadgesToUnderstand.Partner.setLink('xqcow')
    ]) //Owns xQc's Jungle
};