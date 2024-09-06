// Export variables and functions
import { React, ReactDOM } from '@dium/modules';
export { React, ReactDOM, classNames } from '@dium/modules/npm';
export default React;

export * from './components';
export * from './hooks';

export const render = ReactDOM.render

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
    useId, 
    useDeferredValue,
    useInsertionEffect,
    useSyncExternalStore,
    useTransition,

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

export type Fiber = any;

export type Children = Arrayable<React.ReactNode | JSX.Element>;
export type ComponentFiber<Props = {}, State = {}> = Fiber 
    // @ts-ignore
    & Record<Pick<Fiber, 'pendingProps' | 'memoizedProps'>, Props>
    // @ts-ignore
    & Record<Pick<Fiber, 'memoizedState' | 'stateNode'>, State>;
export type Component<Props = {}, State = any> = React.Component<Props, State> | React.FunctionComponent<Props> | React.ComponentClass<Props, State>;
export * from '@dium/utils/react';