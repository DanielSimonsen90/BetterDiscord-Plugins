import * as Components from '@danho-lib/React/components';
import * as Hooks from '@danho-lib/React/hooks';

const { React } = BdApi;

type CompiledReact = typeof React & {
    Components: typeof Components,
    Hooks: typeof Hooks,
}

const CompiledReact: CompiledReact = {
    ...React,
    Components,
    Hooks,
}

export default CompiledReact;