import type { JSX } from 'react';
import type { Arrayable } from './types';

type RenderedComponentResultDefaultProps = {
  children: Arrayable<RenderedComponentResult> | null,
};

export type RenderedComponentResult<P = RenderedComponentResultDefaultProps, Type = unknown> = {
  key: string | null,
  props: P,
  ref: null,
  type: Type extends keyof React.JSX.IntrinsicElements ? Type
  : Type extends React.JSX.BD.Memo<any> ? Type
  : Type extends unknown ? Function | keyof React.JSX.IntrinsicElements
  : never,
  _owner: null,
} | null;

export type CallbableRenderedComponentResult<P = RenderedComponentResultDefaultProps, Type = unknown> = (props: P) => RenderedComponentResult<P, Type>;

declare global {
  namespace React {
    namespace JSX {
      namespace BD {
        type Rendered<P = RenderedComponentResultDefaultProps, Type = unknown> = RenderedComponentResult<P, Type>;
        type FC<P = RenderedComponentResultDefaultProps, RP = P, Type = unknown> = (props: P) => RenderedComponentResult<RP, Type>;
        type FCF<P = RenderedComponentResultDefaultProps, RP = P, Type = unknown> = (props: P) => CallbableRenderedComponentResult<RP, Type>;
        type Memo<P = RenderedComponentResultDefaultProps, RP = P, Type = unknown> = {
          displayName: string;
          type: (props: P) => React.JSX.BD.Rendered<RP, Type>;
        };

        type FRC<Props, RenderedProps, RefElementType = HTMLDivElement> = {
          displayName?: string;
          render: (props: Props, ref: React.RefObject<RefElementType>) => React.JSX.BD.Rendered<RenderedProps>;
        };
      }
    }
  }
}