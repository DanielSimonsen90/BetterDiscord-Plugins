import React, { ComponentFiber } from "../React";
import ReactDOM from 'react-dom';

type ReactUtils = typeof React & typeof ReactDOM & {
    getInstance<Props = {}, State = any>(node: Node): ComponentFiber<Props, State> | null;
}
export default ReactUtils;