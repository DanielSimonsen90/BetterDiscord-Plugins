// Export variables and functions
import { React, ReactDOM } from 'discordium';
export { React, ReactDOM, classNames } from '@discordium/modules/npm';
export default React;

export * from './components';
export * from './hooks';

// Exporing this render instead of ReactDOM.render because DevilBro actually listens to the DOM and removes the component from the React tree when it's not in use
export const render = window.BDFDB?.ReactUtils.render;

export const {
    useCallback,
    useContext,
    useDebugValue,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useMemo,
    useReducer,
    useRef,
    useState,

    createRef,
    createContext,
    createElement,
    createFactory,

    forwardRef,
    cloneElement,
    lazy,
    memo,
    isValidElement,
    Component,
    PureComponent,
    Fragment
} = React;

export const {
    createPortal,
    findDOMNode,
    flushSync,
    hydrate,
    unmountComponentAtNode
} = ReactDOM;

// Export types
import { Arrayable } from 'danholibraryjs';
export {
    ComponentClass,
    FunctionComponent,
    MouseEventHandler,
    DependencyList,
    Dispatch,
    SetStateAction
} from 'react';

import { Fiber } from '@discordium/api/react';
export type Children = Arrayable<React.ReactNode | JSX.Element>;
export type ComponentFiber<Props = {}, State = {}> = Fiber 
    // @ts-ignore
    & Record<Pick<Fiber, 'pendingProps' | 'memoizedProps'>, Props>
    // @ts-ignore
    & Record<Pick<Fiber, 'memoizedState' | 'stateNode'>, State>;
export type Component<Props = {}, State = any> = React.Component<Props, State> | React.FunctionComponent<Props> | React.ComponentClass<Props, State>;
export * from '@discordium/utils/react';
export * from '@discordium/api/react';