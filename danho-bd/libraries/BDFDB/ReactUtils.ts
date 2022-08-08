import React, { ComponentFiber, ReactDOM } from "@react";

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
        filter?: (component: ComponentFiber) => boolean;
        depth?: number;
        time?: number;
    }): ComponentFiber | null;
    setChild(parent: React.ReactElement, child: React.ReactElement | string): void;
}
export default ReactUtils;