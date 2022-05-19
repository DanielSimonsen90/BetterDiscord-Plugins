import React, { ComponentFiber, ReactDOM } from "../React";

type ReactUtils = typeof React & typeof ReactDOM & {
    getInstance<Props = {}, State = any>(node: Node): ComponentFiber<Props, State> | null;
}
export default ReactUtils;