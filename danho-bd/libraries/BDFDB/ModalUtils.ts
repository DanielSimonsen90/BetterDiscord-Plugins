import { Children, Component } from "../React";

type ModalProps = {
    text?: string,
    size?: string,
    className?: string,
    buttons?: Array<{
        contents?: string,
        color?: string,
        look?: string,
        click?: () => void,
        cancel?: boolean,
        close?: boolean,
    }>,

    children?: Children,

    onClose?: () => void,
    onOpen?: () => void,

    header?: Component,
    headerSeperator?: boolean,
    subHeader?: Component,

    contentClassName?: string,
    scroller?: boolean,
    direction?: string,
    content?: Component | string,

    footerClassName?: string,
    footerDirection?: string,

} & Partial<Record<`${
    'tabBar' | 'content' | 'header' | 'footer'
}Children`, Children>>;

export type ModalUtils = {
    open(plugin: any, config: ModalProps): void;
    confirm(plugin: any, text: string, callback: () => void): void;
}