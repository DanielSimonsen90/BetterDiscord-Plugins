import CompiledReact from './CompiledReact';
import $, { DQuery } from '@danho-lib/DOM/dquery';
import ElementSelector from '@danho-lib/DOM/ElementSelector';

type DanhoModules = {
    CompiledReact: CompiledReact,
    $: typeof $,
    DQuery: typeof DQuery,
    ElementSelector: typeof ElementSelector,
}

const DanhoModules: DanhoModules = {
    CompiledReact,
    $,
    DQuery,
    ElementSelector,
}

export default DanhoModules;