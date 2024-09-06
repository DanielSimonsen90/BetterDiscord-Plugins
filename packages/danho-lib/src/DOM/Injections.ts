import $, { Selector } from "./dquery";

type PluginInjectionItem = {
  element: HTMLElement;
};

let injections: Array<PluginInjectionItem> = [];

export function injectElement(
  parentSelectorResolve: Selector<HTMLElement>, 
  element: HTMLElement,
  type: 'beforeend' | 'afterend' | 'beforebegin' | 'afterbegin' = 'beforeend'
): void {
  $(parentSelectorResolve).element?.insertAdjacentElement(type, element);
  injections.push( {element });
}

export function removeAllInjections(): void {
  injections.forEach(({ element }) => element.remove());
  injections = [];
}