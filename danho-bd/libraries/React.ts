import { PropertiesWithout, BetterOmit, Arrayable } from 'danholibraryjs';
import React, { Component } from 'react';
export { default as React, Component } from 'react';
export { default as ReactDOM } from 'react-dom';

export type BaseProps = {
    className?: string,
    children?: Children
}

// export type Component<P = BaseProps, S = {}> = {
//     props: P;
//     state: S;
//     type: keyof HTMLElementTagNameMap;
//     key: string;
//     ref: { current: HTMLElement };

//     setState(state: S): void
//     componentDidMount(): void
//     componentDidUpdate(): void
//     componentWillUnmount(): void
//     render(): any;
// }

export type Children<Props = {}> = Arrayable<Component<Props>>
export type ComponentInstance<Props = {}, RemoveChildren extends boolean = false> = BetterOmit<PropertiesWithout<Function, Component<Props>>, 'state'> & {
    props: BetterOmit<BaseProps, 'children'> & RemoveChildren extends true ? {} : {
        children: Arrayable<ComponentInstance>
    }
}

export type ComponentFiber<Props = {}, State = null> = {
    alternative?: ComponentFiber<Props>,
    child?: ComponentFiber<Props>,
    childLanes: number,
    dependencies?: Array<any>,
    elementType: keyof HTMLElementTagNameMap,
    firstEffect?: ComponentFiber<Props>,
    flags: number,
    index: number,
    key?: string,
    lanes: number,
    lastEffect?: ComponentFiber<Props>,
    memoizedProps?: Props,
    memoizedState?: State,
    mode: number,
    nextEffect?: ComponentFiber<Props>,
    pendingProps?: Props,
    ref?: { current: HTMLElement },
    return?: ComponentFiber<Props>,
    sibling?: ComponentFiber<Props>,
    stateNode?: HTMLElement,
    tag: number,
    type: keyof HTMLElementTagNameMap,
    updateQueue: null
}
export type ObservationNode<Props = {}> = {
    __reactFiber$?: ComponentFiber<Props>,
    __reactProps$?: Props,
}

export type MouseEventHandler = (e: MouseEvent) => void;

export default React;