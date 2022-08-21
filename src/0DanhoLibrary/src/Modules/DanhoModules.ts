import CompiledReact from './CompiledReact';
import $, { DQuery } from '@dquery';
import ElementSelector from 'danho-discordium/ElementSelector';
import parseBioReact from '@discordium/modules/parseBioReact';

type DanhoModules = {
    CompiledReact: CompiledReact,
    $: typeof $,
    DQuery: typeof DQuery,
    ElementSelector: typeof ElementSelector,
    parseBioReact: typeof parseBioReact,
}

const DanhoModules: DanhoModules = {
    CompiledReact,
    $,
    DQuery,
    ElementSelector,
    parseBioReact,
}

export default DanhoModules;