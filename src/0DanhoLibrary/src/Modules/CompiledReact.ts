import * as Components from 'danho-discordium/React/components';
import * as Hooks from 'danho-discordium/React/hooks';
import * as React from '@react';

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