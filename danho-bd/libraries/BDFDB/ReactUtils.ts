import React, { ComponentFiber } from "../React";
import ReactDOM from 'react-dom';

type ReactUtils = typeof React & typeof ReactDOM & {
    getInstance<Props = {}, State = any>(node: Node): ComponentFiber<Props, State> | null;
    forceUpdate(...instances: Array<any>): void;
    findOwner(nodeOrInstance: Node, cofig: {
        name: string
        unlimited?: boolean
        up?: boolean;
        group?: boolean;
        all?: boolean;
        type?: string;
        filter?: (component: ComponentFiber<any, any>) => boolean;
        depth?: number;
        time?: number;
    })
}
export default ReactUtils;