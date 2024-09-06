import { hljs, i18n, lodash, moment, semver, React, ReactDOM } from '@dium/modules';
import DanhoModules from './DanhoModules';

export type DiscordModules = DanhoModules & {
    hljs: typeof hljs,
    i18n: typeof i18n,
    lodash: typeof lodash,
    moment: typeof moment,
    semver: typeof semver,

    React: typeof React,
    ReactDOM: typeof ReactDOM,
    
}

export const DiscordModules = {
    /** Code/Block highlighter */
    hljs, 
    /** Translation module */
    i18n, 
    /** Utility module */
    lodash, 
    /** Date/Time module */
    moment, 
    /** Version module */
    semver,
    React, ReactDOM, 
    ...DanhoModules
}