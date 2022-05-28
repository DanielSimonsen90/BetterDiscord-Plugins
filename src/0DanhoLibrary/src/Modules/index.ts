import { Modules } from 'discordium';
import DanhoModules from './DanhoModules';
import * as Discord from '@discord';

const { hljs, i18n, joi, lodash, moment, semver, React, ReactDOM } = Modules;

export type DiscordModules = {
    hljs: typeof hljs,
    i18n: typeof i18n,
    joi: typeof joi,
    lodash: typeof lodash,
    moment: typeof moment,
    semver: typeof semver,

    Discord: typeof Discord,

    React: typeof React,
    ReactDOM: typeof ReactDOM,
    DanhoModules: typeof DanhoModules
}

export const DiscordModules = {
    hljs, i18n, joi, lodash, moment, semver,
    Discord,
    React, ReactDOM, DanhoModules
}