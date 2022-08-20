import ZLibrary from '@ZLibrary';
import BDFDB from '@BDFDB';
const { BDFDB } = window.BDD?.Libraries ?? window;

import * as Finder from '@discordium/api/finder';

export const Margins: ZLibrary['DiscordClassModules']['Margins'] = Finder.byProps("marginLarge");
export const ClassModules: typeof ZLibrary.DiscordClassModules & typeof BDFDB.DiscordClassModules = Object.assign({}, ZLibrary.DiscordClassModules, BDFDB.DiscordClassModules);
