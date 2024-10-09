// Export variables and functions
import { React, ReactDOM } from '@dium/modules';
export { React, ReactDOM, classNames } from '@dium/modules/npm';
export default React;

export * from './components';
export * from './hooks';

export const render = ReactDOM.render;

export const {
  useCallback,
  useContext,
  useDebugValue,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useId,
  useDeferredValue,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition,

  createRef,
  createContext,
  createElement,
  createFactory,

  forwardRef,
  cloneElement,
  lazy,
  memo,
  isValidElement,
  Component,
  PureComponent,
  Fragment
} = React;

export const {
  createPortal,
  findDOMNode,
  flushSync,
  hydrate,
  unmountComponentAtNode
} = ReactDOM;

// Export types
export {
  ComponentClass,
  FunctionComponent,
  MouseEventHandler,
  DependencyList,
  Dispatch,
  SetStateAction
} from 'react';

export * from '@dium/utils/react';

export const renderChildren = (children: Element[], props = {}): Array<JSX.Element> => children.map(child => React.createElement(
  child.tagName,
  Array.from(child.attributes).reduce((acc, { name, value }) => ({ ...acc, [name]: value }), props),
  child.outerHTML.match(/</g).length > 2 ? renderChildren(Array.from(child.children)) : child.textContent
));