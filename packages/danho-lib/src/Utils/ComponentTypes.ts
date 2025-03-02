import type { Arrayable } from './types';

type RenderedComponentResultDefaultProps = {
  children: Arrayable<RenderedComponentResult> | null,
};

export type RenderedComponentResult<P = RenderedComponentResultDefaultProps, Type = unknown> = {
  key: string | null,
  props: P,
  ref: null,
  type: Type extends true ? Function
  : Type extends keyof JSX.IntrinsicElements ? Type
  : Type extends unknown ? Function | keyof JSX.IntrinsicElements
  : never,
  _owner: null,
} | null

export type CallbableRenderedComponentResult<P = RenderedComponentResultDefaultProps> = (props: P) => RenderedComponentResult<P>;

declare global {
  namespace JSX.BD {
    type Rendered<P = RenderedComponentResultDefaultProps, Type = unknown> = RenderedComponentResult<P, Type>;
    type FC<P = RenderedComponentResultDefaultProps, RP = P> = (props: P) => RenderedComponentResult<RP>;
    type FCF<P = RenderedComponentResultDefaultProps, RP = P> = (props: P) => CallbableRenderedComponentResult<RP>;

    type FRC<Props, RenderedProps, RefElementType = HTMLDivElement> = {
      displayName?: string;
      render: (props: Props, ref: React.RefObject<RefElementType>) => JSX.BD.Rendered<RenderedProps>;
    }
  }
}