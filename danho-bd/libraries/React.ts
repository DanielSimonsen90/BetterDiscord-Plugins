import { PropertiesWithout, BetterOmit, Arrayable } from 'danholibraryjs';
import Component from "danho-discordium/components/Component";
import { React } from 'discordium';

export type BaseProps = {
    className?: string,
    children?: Children
}

export type Children = Arrayable<JSX.Element>
export type ComponentInstance<Props = {}, RemoveChildren extends boolean = false> = PropertiesWithout<Function, Component<Props>> & {
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

export type MouseEventHandler<Element extends HTMLElement> = (e: React.MouseEvent<Element>) => void;

export default React;