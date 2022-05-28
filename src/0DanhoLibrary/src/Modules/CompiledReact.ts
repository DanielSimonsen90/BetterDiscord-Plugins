import * as Components from 'danho-discordium/components';
import * as Hooks from 'danho-discordium/hooks';
import { React, ReactDOM, classNames } from 'discordium';
import * as BadReact from '@lib/React';

type CompiledReact = typeof React & typeof ReactDOM & {
    Components: typeof Components,
    Hooks: typeof Hooks,
    classNames: typeof classNames,
    BadReact: typeof BadReact
}

const CompiledReact: CompiledReact = {
    ...React,
    ...ReactDOM,
    Components,
    Hooks,
    classNames,
    BadReact
}

export default CompiledReact;