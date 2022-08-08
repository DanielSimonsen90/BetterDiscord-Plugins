import { hljs, i18n, joi, lodash, moment, semver, React, ReactDOM } from '@discordium/modules';
import DanhoModules from './DanhoModules';
import * as Discord from '@discord';

export type DiscordModules = DanhoModules & {
    hljs: typeof hljs,
    i18n: typeof i18n,
    joi: typeof joi,
    lodash: typeof lodash,
    moment: typeof moment,
    semver: typeof semver,

    Discord: typeof Discord,

    React: typeof React,
    ReactDOM: typeof ReactDOM,
    
}

export const DiscordModules = {
    /** Code/Block highlighter */
    hljs, 
    /** Translation module */
    i18n, 
    /** Data Validation module */
    joi, 
    /** Utility module */
    lodash, 
    /** Date/Time module */
    moment, 
    /** Version module */
    semver,
    Discord,
    React, ReactDOM, 
    ...DanhoModules
}