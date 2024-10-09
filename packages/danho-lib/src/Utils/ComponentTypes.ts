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
    type FC<P = RenderedComponentResultDefaultProps, RP = P> = CallbableRenderedComponentResult<RP>;
    type FCF<P = RenderedComponentResultDefaultProps, RP = P> = (props: P) => CallbableRenderedComponentResult<RP>;
  }
}