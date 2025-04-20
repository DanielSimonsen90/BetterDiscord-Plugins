import { Fiber } from '@dium';
import { React } from './React';
import { $, ElementSelector } from '@dom';
export const renderChildren = (children: Element[], props = {}): Array<JSX.Element> => children.map(child => React.createElement(
  child.tagName,
  Array.from(child.attributes).reduce((acc, { name, value }) => ({ ...acc, [name]: value }), props),
  child.outerHTML.match(/</g).length > 2 ? renderChildren(Array.from(child.children)) : child.textContent
));

type ClassName = string | boolean | undefined | null | number
export function classNames(...classNames: ClassName[]): string {
  return classNames.filter(Boolean).join(' ');
}

export function getOwnerElement(rootSelector: (selector: ElementSelector) => ElementSelector, componentType: any) {
  const root = $(rootSelector);
  if (!root) return null;

  const walkReturn = (fiber: Fiber) => {
    if (!fiber) return null;
    if (fiber.type === componentType) return fiber;
    return walkReturn(fiber.return);
  }
  const fiber = root.fiber;
  if (!fiber) return null;

  const instance = walkReturn(fiber.return);
  if (!instance) return null;

  const walkChild = (fiber: Fiber) => {
    if (!fiber) return null;
    if (fiber.stateNode instanceof HTMLElement) return fiber.stateNode;
    return walkChild(fiber.child);
  }
  const element = walkChild(instance.child);
  return element ? $(element) : null;
}