import * as DiumFinder from '@dium/api/finder';
import React, { Component } from '../../React/React';
import { createLogger } from '../logger';
import { ErrorBoundary } from '../../React/components/ErrorBoundary';
import { Patcher } from '@dium';

const Logger = createLogger('patchComponentBySourceStrings');

type TComponentProps<TProps, TRenderedProps> = {
  result: React.JSX.BD.Rendered<TRenderedProps>;
  component: typeof Component;
  props: TProps;
};
type Callback<TComponentProps> = (props: TComponentProps) => React.JSX.Element;
type SourceStringsArgs<TComponentProps> = [...string[], callback: Callback<TComponentProps>];

export function patchComponentBySourceStrings<TProps = any, TRenderedProps = any>(...args: SourceStringsArgs<TComponentProps<TProps, TRenderedProps>>): void {
  const jsxModule = DiumFinder.byKeys(['jsx']);
  const callback = args.pop() as Callback<TComponentProps<TProps, TRenderedProps>>;
  const keywords = args.map(keyword => keyword.toString().replace(/\s+/g, ''));

  Patcher.instead(jsxModule, 'jsx', ({ original, args }) => {
    try {
      const [component, props, children] = args;
      const result = original(...args);

      Logger.debugLog({ component, props, children, result });

      if (typeof component === 'function' && keywords.every(keyword => component.toString().includes(keyword))) {
        const patchedResult = callback({
          result, component,
          props: Object.assign({}, props, { children: props.children ?? children }),
        });

        return <ErrorBoundary>{patchedResult}</ErrorBoundary>;
      }

      return result;
    }
    catch (err) {
      Logger.error('Error in patching component', err);
    }
  }, { name: `patchComponentBySourceStrings([${keywords.join(',')}])` });
};

export default patchComponentBySourceStrings;