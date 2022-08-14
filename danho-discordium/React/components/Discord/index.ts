import * as Finder from '@discordium/api/finder';
export * from '@discordium/modules/components';
export * as Icons from './Icons';

import ZLibrary from '@ZLibrary';
import BDFDB from '@BDFDB';
const { BDFDB } = window.BDD?.Libraries ?? window;

import Avatar from './Avatar';
import Button from './Button';
import ChannelEditorContainer from './ChannelEditorContainer';
import Clickable from './Clickable';
import DiscordTag from './DiscordTag';
import Form from './Form';
import { SwitchItem, TextInput } from './Inputs';
import Tooltip from './Tooltip';
import SelectMenu from './SelectMenu';
import Shakeable from './Shakeable';
import SystemMessage from './SystemMessage';
import UserProfileBadgeList from './UserProfileBadgeList';

export const Margins: ZLibrary['DiscordClassModules']['Margins'] = Finder.query({ props: ["marginLarge"] });
export const ClassModules: typeof ZLibrary.DiscordClassModules & typeof BDFDB.DiscordClassModules = Object.assign({}, ZLibrary.DiscordClassModules, BDFDB.DiscordClassModules);

export const Avatar: Avatar = Finder.query({ props: ['AnimatedAvatar'] });
export const Button: Button = Finder.query({ props: ["Link", "Hovers"] });
export const Clickable: Clickable = Finder.query({ name: "Clickable" });
export const ChannelEditorContainer: ChannelEditorContainer = Finder.query({ name: "ChannelEditorContainer" });
export const DiscordTag: DiscordTag = Finder.query({ name: "DiscordTag" }).default;
export const Form: Form = Finder.query({ props: ["FormItem", "FormSection", "FormDivider"] });
export const Shakeable: Shakeable = Finder.query({ name: "Shakeable" }).default;
export const GetSelectMenu: <Type extends string | number = string>() => SelectMenu<Type> = () => Finder.query({ props: ["Select"] });
export const SystemMessage: SystemMessage = Finder.query({ name: "SystemMessage" });
export const Tooltip: Tooltip = Finder.query({ props: ['TooltipContainer'] });
export const UserProfileBadgeList: UserProfileBadgeList = Finder.query({ name: "UserProfileBadgeList" });

const SwitchItemDefault: SwitchItem = Finder.query({ name: "SwitchItem" }).default;
const TextInputDefault: TextInput = Finder.query({ name: "TextInput" }).default;

export {
    SwitchItemDefault as SwitchItem,
    TextInputDefault as TextInput,
}