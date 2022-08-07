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
    }): ComponentFiber<any, any> | null;
    setChild(parent: React.ReactElement, child: React.ReactElement | string): void;
}
export default ReactUtils;