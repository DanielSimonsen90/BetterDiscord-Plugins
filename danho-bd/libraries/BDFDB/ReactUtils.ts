import ReactModule, { ComponentFiber, ReactDOMModule } from "../React";

type ReactUtils = ReactModule & ReactDOMModule & {
    getInstance<Props = {}, State = any>(node: Node): ComponentFiber<Props, State> | null;
}
export default ReactUtils;