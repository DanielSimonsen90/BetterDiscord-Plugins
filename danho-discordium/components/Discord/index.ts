import { Finder } from 'discordium';

import * as DiumModules from '@discordium/modules/discord'
import ZLibrary from '@ZLibrary';
import BDFDB from '@BDFDB';
const { BDFDB } = window.BDD?.Libraries ?? window;

import Avatar from './Avatar';
import Button from './Button';
import Clickable from './Clickable';
import DiscordTag from './DiscordTag';
import Form from './Form';
import { SwitchItem, TextInput } from './Inputs';
import Tooltip from './Tooltip';
import Shakeable from './Shakeable';
import UserProfileBadgeList from './UserProfileBadgeList';

export namespace Discord {
    export const Modules = DiumModules;
    export const Margins: ZLibrary['DiscordClassModules']['Margins'] = Finder.query({ props: ["marginLarge"] });
    export const ClassModules: typeof ZLibrary.DiscordClassModules & typeof BDFDB.DiscordClassModules = Object.assign({}, ZLibrary.DiscordClassModules, BDFDB.DiscordClassModules);

    export const Avatar: Avatar = Finder.query({ props: ['AnimatedAvatar'] });
    export const Button: Button = Finder.query({ props: ["Link", "Hovers"] });
    export const Clickable: Clickable = Finder.query({ name: "Clickable" });
    export const DiscordTag: DiscordTag = Finder.query({ name: "DiscordTag" }).default;
    export const Form: Form = Finder.query({ props: ["FormItem", "FormSection", "FormDivider"] });
    export const Shakeable: Shakeable = Finder.query({ name: "Shakeable" }).default;
    export const SwitchItem: SwitchItem = Finder.query({ name: "SwitchItem" }).default;
    export const TextInput: TextInput = Finder.query({ name: "TextInput" }).default;
    export const Tooltip: Tooltip = Finder.query({ props: ['TooltipContainer'] });
    export const UserProfileBadgeList: UserProfileBadgeList = Finder.query({ name: "UserProfileBadgeList" });
}

export default Discord;