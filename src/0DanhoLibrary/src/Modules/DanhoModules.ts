import CompiledReact from './CompiledReact';
import $, { DQuery } from '@dquery';
import ElementSelector from 'danho-discordium/ElementSelector';

type DanhoModules = {
    CompiledReact: CompiledReact,
    $: typeof $,
    DQuery: typeof DQuery,
    ElementSelector: typeof ElementSelector
}

const DanhoModules: DanhoModules = {
    CompiledReact,
    $,
    DQuery,
    ElementSelector
}

export default DanhoModules;