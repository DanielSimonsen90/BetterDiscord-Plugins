import { BaseProps, Component } from './libraries/React';

export function DanhoComponent<Props = BaseProps, State = {}>(React: any) {
    return class DanhoComponent extends React.Component {
        constructor(public props: Props) {
            super(props);
            this.state = {} as State;
        }

        public state: State;
        public type: keyof HTMLElementTagNameMap;
        public key: string;
        public ref: { current: HTMLElement };
        public setState(state: State): void {
            super.setState(state);
        }
        public componentDidMount(): void {}
        public componentDidUpdate(): void {}
        public componentWillUnmount(): void {}
        public render(): Component {
            return React.createElement("div", {
                style: {
                    fontSize: "3em",
                    color: "var(--text-normal)"
                }
            }, "Hello, world!")
        }

       public createElement<
            P = {}, 
            Element extends (Component<P> | keyof HTMLElementTagNameMap) = Component<P>,
            Props = Element extends keyof HTMLElementTagNameMap ? keyof HTMLElementTagNameMap[Element] : P
        >(component: Component<P> | keyof HTMLElementTagNameMap, props: Props, children?: Component | Array<Component>): Component {
            return React.createElement(component, props, children);
        }
    }
}

