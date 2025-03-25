import type { Arrayable } from './types';

type RenderedComponentResultDefaultProps = {
  children: Arrayable<RenderedComponentResult> | null,
};

export type RenderedComponentResult<P = RenderedComponentResultDefaultProps, Type = unknown> = {
  key: string | null,
  props: P,
  ref: null,
  type: Type extends keyof JSX.IntrinsicElements ? Type
  : Type extends JSX.BD.Memo<any> ? Type
  : Type extends unknown ? Function | keyof JSX.IntrinsicElements
  : never,
  _owner: null,
} | null;

export type CallbableRenderedComponentResult<P = RenderedComponentResultDefaultProps, Type = unknown> = (props: P) => RenderedComponentResult<P, Type>;

declare global {
  namespace JSX.BD {
    type Rendered<P = RenderedComponentResultDefaultProps, Type = unknown> = RenderedComponentResult<P, Type>;
    type FC<P = RenderedComponentResultDefaultProps, RP = P, Type = unknown> = (props: P) => RenderedComponentResult<RP, Type>;
    type FCF<P = RenderedComponentResultDefaultProps, RP = P, Type = unknown> = (props: P) => CallbableRenderedComponentResult<RP, Type>;
    type Memo<P = RenderedComponentResultDefaultProps, RP = P, Type = unknown> = {
      displayName: string;
      type: (props: P) => JSX.BD.Rendered<RP, Type>;
    };

    type FRC<Props, RenderedProps, RefElementType = HTMLDivElement> = {
      displayName?: string;
      render: (props: Props, ref: React.RefObject<RefElementType>) => JSX.BD.Rendered<RenderedProps>;
    };
  }
}