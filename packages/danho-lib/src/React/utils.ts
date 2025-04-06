import { React } from './React';
export const renderChildren = (children: Element[], props = {}): Array<JSX.Element> => children.map(child => React.createElement(
  child.tagName,
  Array.from(child.attributes).reduce((acc, { name, value }) => ({ ...acc, [name]: value }), props),
  child.outerHTML.match(/</g).length > 2 ? renderChildren(Array.from(child.children)) : child.textContent
));

type ClassName = string | boolean | undefined | null | number
export function classNames(...classNames: ClassName[]): string {
  return classNames.filter(Boolean).join(' ');
}