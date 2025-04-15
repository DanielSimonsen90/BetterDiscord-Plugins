import { Arrayable } from '../Utils/types';
import { Utils } from '@dium/index';
import ElementSelector from './ElementSelector';
import { If, PromisedReturn } from '../Utils/types';
import { getFiber } from '@dium/utils';
import { StringUtils } from '@utils';

type Fiber = any;

export type SelectorCallback<Element extends Arrayable<HTMLElement> = HTMLElement> =
  ((selector: ElementSelector, _$: typeof $) => ElementSelector | string | DQuery<HTMLElement> | Element);
export type Selector<Element extends Arrayable<HTMLElement> = HTMLElement> =
  | string
  | Element
  | ElementSelector
  | (Element extends HTMLElement ? DQuery<HTMLElement> : Array<DQuery<HTMLElement>>)
  | SelectorCallback<Element>;

export function $<
  Single extends boolean = true,
  T extends HTMLElement = HTMLElement,
  El extends Single extends true ? T : Array<T> = Single extends true ? T : Array<T>,
>(selector: Selector<El>, single: Single = true as Single): If<Single, DQuery<T>, Array<DQuery<T>>> | undefined {
  if (single) {
    const dq = new DQuery(selector as Selector<T>) as any;
    return dq.element ? dq : undefined;
  }

  let elements = (() => {
    if (typeof selector === 'function') {
      selector = selector(new ElementSelector(), $) as Selector<El>;
    }
    if (selector instanceof ElementSelector || typeof selector === 'string')
      return [...document.querySelectorAll<T>(selector.toString()).values()] as Array<T>;
    else if (selector instanceof DQuery) {
      return [selector.element] as Array<T>;
    }
    return (Array.isArray(selector) ? selector : [selector]) as Array<T>;
  })();

  return elements.filter(Boolean).map(el => new DQuery<T>(el)) as any;
}
export async function $p<
  Single extends boolean = true,
  T extends HTMLElement = HTMLElement,
  El extends Single extends true ? T : Array<T> = Single extends true ? T : Array<T>,
>(selector: PromisedReturn<SelectorCallback<El>>, single: Single = true as Single): Promise<If<Single, DQuery<T>, Array<DQuery<T>>>> {
  const resolved = await selector(new ElementSelector(), $);

  if (single) return new DQuery(resolved as any) as any;

  let elements = (() => {
    if (resolved instanceof ElementSelector || typeof resolved === 'string')
      return [...document.querySelectorAll<T>(resolved.toString()).values()] as Array<T>;
    else if (resolved instanceof DQuery) {
      return [resolved.element] as Array<T>;
    }
    return (Array.isArray(resolved) ? resolved : [resolved]) as Array<T>;
  })();

  return elements.map(el => new DQuery<T>(el)) as any;
}

export type DQuery$ = typeof $;
export type DQuery$p = typeof $p;

export class DQuery<El extends HTMLElement = HTMLElement> {
  constructor(private selector: Selector<El>) {
    if (selector) {
      const element = (
        selector instanceof HTMLElement ? selector as El :
          selector instanceof DQuery ? selector.element as El :
            selector instanceof ElementSelector || typeof selector === 'string' ? document.querySelector<El>(selector.toString()) :
              typeof selector === 'function' ? new DQuery<El>(selector(new ElementSelector(), $) as Selector<El>).element :
                selector
      );

      // if (!element
      //     && selector
      //     && !(typeof selector === 'function') // ElementSelector.getElementFromInstance(instance) might not find the element
      // ) console.trace(`%cCould not find element with selector: ${selector}`, "color: lightred; background-color: darkred;");

      this.element = element;
    }
  }

  public element: El | undefined;
  public get parent(): DQuery<El> | undefined {
    try {
      return this.element.parentElement ? new DQuery<El>(this.element.parentElement as any) : undefined;
    }
    catch (err) {
      console.error(err, this.selector);
      return undefined;
    }
  }

  public get previousSibling(): DQuery<El> {
    return new DQuery<El>(this.element.previousElementSibling as El);
  }
  public get nextSibling(): DQuery<El> {
    return new DQuery<El>(this.element.nextElementSibling as El);
  }
  public get value() {
    if ('value' in this.element) return this.element['value'] as string | number;
    if ('checked' in this.element) return this.element['checked'] as boolean;
    return this.element.textContent;
  }
  public get classes() {
    return this.element.classList.value;
  }
  public get style() {
    return this.element.style;
  }
  public set style(value: Partial<CSSStyleDeclaration>) {
    for (const key in value) {
      if (!isNaN(Number(key))) continue; // skip numeric keys if any
      this.element.style[key] = value[key];
    }
  }
  public setStyleProperty(key: keyof CSSStyleDeclaration | string, value: string) {
    key = StringUtils.kebabCaseFromCamelCase(key.toString());
    const style = this.attr('style') ?? '';
    if (!style.includes(key)) return this.attr('style', `${this.attr('style') ?? ''}${key as string}: ${value};`, false);

    const regex = new RegExp(`${key}: [^;]*;`, 'g');
    this.attr('style', style.replace(regex, `${key}: ${value};`), false);
    return;
  }

  public addClass(className: string) {
    if (!this.hasClass(className)) this.element.classList.add(className);
    return this;
  }
  public hasClass(className: string) {
    return this.element.classList.contains(className);
  }
  public removeClass(className: string) {
    if (this.hasClass(className)) this.element.classList.remove(className);
    return this;
  }

  public hasDirectChild(selector: Selector<El>): boolean {
    if (selector instanceof DQuery) selector = selector.element as El;
    else if (typeof selector === 'string') selector = document.querySelector<El>(selector);

    for (const child of this.element.children) {
      if (child == selector) return true;
    }
    return false;
  }
  public children<
    El extends HTMLElement = HTMLElement,
    Select extends Selector<El> = Selector<El>,
    Single extends Select extends string ? boolean : never = Select extends string ? false : never
  >(selector?: Selector<El>, single?: Single): If<Single, DQuery<El>, Array<DQuery<El>>> {
    if (!this.element) return single ? undefined : [] as any;
    if (!selector) return single ? new DQuery<El>(this.element.children[0] as El) as any : [...this.element.children].map(child => new DQuery<El>(child as El)) as any;

    selector = typeof selector === 'function' ? selector(new ElementSelector(), $) as El : selector;

    if (typeof selector === 'string' || selector instanceof ElementSelector) {
      const elements = this.element.querySelectorAll(selector.toString());
      return single ? new DQuery<El>(elements[0] as El) as any : [...elements.values()].map(child => new DQuery<El>(child as El)) as any;
    }

    const getElement = (element: Element): El => {
      const childrenArray = [...element.children];
      if (childrenArray.some(child => child === selector)) return element as El;

      for (const child of childrenArray) {
        const result = getElement(child);
        if (result) return result;
      }
      return undefined;
    };
    return getElement(this.element) ? $(getElement(this.element) as El) as any : undefined;
  }
  public get firstChild() {
    return this.children()[0];
  }
  public get lastChild() {
    const children = this.children();
    return children[children.length - 1];
  }
  public hasChildren<El extends HTMLElement = HTMLElement>(selector?: Selector<El>) {
    return this.children(selector).length > 0
  }

  public grandChildren<
    El extends HTMLElement = HTMLElement,
    Select extends Selector<El> = Selector<El>,
    Single extends Select extends string ? boolean : never = Select extends string ? false : never
  >(selector?: Selector<El>, single?: Single): If<Single, DQuery<El>, Array<DQuery<El>>> {
    const grandChildren = this.children().map(child => child.children(selector, single)).flat();
    return (single ? grandChildren[0] : grandChildren) as any;
  }

  public ancestor<El extends HTMLElement = HTMLElement>(selector: Selector<El>): DQuery<El> {
    const getAnscestorSelector = () => {
      const _selector = typeof selector === 'function' ? selector(new ElementSelector(), $) : selector;

      if (typeof _selector === 'string') return _selector;
      if (_selector instanceof ElementSelector) return _selector.toString();

      if (_selector instanceof DQuery) return ElementSelector.getSelectorFromElement(_selector.element);
      if (_selector instanceof HTMLElement) return ElementSelector.getSelectorFromElement(_selector);

      return undefined;
    };

    const anscestorSelector = getAnscestorSelector();
    if (!anscestorSelector) return undefined;

    return new DQuery<El>(this.element.closest(anscestorSelector) as El);
  }

  public get fiber() {
    // const key = Object.keys(this.element).find(key => key.startsWith('__reactFiber$'));
    // return key ? this.element[key] as Fiber : undefined;
    return getFiber(this.element);
  }
  public get props() {
    try {
      if (!this.fiber) return null;
      const fiberProps = this.fiber.memoizedProps as Record<string, any>;
      if (fiberProps) return fiberProps;

      const propsKey = Object.keys(this.element).find(key => key.startsWith('__reactProps$'));
      if (propsKey) return this.element[propsKey];

      return null;
    }
    catch (err) {
      console.error(err, this);
      return null;
    }
  }
  public set props(value: Record<string, any>) {
    this.fiber.pendingProps = value;
  }

  // Function should get the property that matches provided key.
  // If no property matches, it should see if object has children or props.
  // If it does, it should recurse into those.
  // Finally, it should return undefined if nothing matches.
  /**
   * 
   * @param key The property key to search for.
   * @param cycleThrough Additional properties to search through, if key cannot be found through .props or .children.
   * @returns [prop: T, path: Array<string>]
   */
  public prop<T extends any = any>(key: string, ...cycleThrough: Array<string>): [prop: T, path: Array<string>] | undefined {
    const getPropThroughFiber = (obj: Record<string, Partial<Record<'props' | 'children' | string, any>>>, path: Array<string>) => {
      if (obj === undefined || obj === null) return undefined;
      else if (obj[key]) return [obj[key], path];

      if (obj.children) {
        if (Array.isArray(obj.children)) {
          for (let i = 0; i < obj.children.length; i++) {
            const result = getPropThroughFiber(obj.children[i], [...path, `children`, i.toString()]);
            if (result) return result;
          }
        } else {
          const result = getPropThroughFiber(obj.children, [...path, 'children']);
          if (result) return result;
        }
      }
      if (obj.props) {
        const result = getPropThroughFiber(obj.props, [...path, 'props']);
        if (result) return result;
      }
      if (cycleThrough) {
        for (const prop of cycleThrough) {
          const result = getPropThroughFiber(obj[prop], [...path, prop]);
          if (result) return result;
        }
      }
      return undefined;
    };
    const getPropThroughDOM = (el: Element, path: Array<string>) => {
      if (el === undefined || el === null) return undefined;
      
      const dq = el instanceof HTMLElement ? new DQuery(el) : new DQuery(ElementSelector.getSelectorFromElement(el));
      if (!dq.element) return undefined;
      
      const props = dq.props;
      if (!props) return undefined;
      else if (props[key]) return [props[key], path];

      if (dq.hasChildren()) {
        for (let i = 0; i < el.children.length; i++) {
          const result = getPropThroughDOM(el.children[i], [...path, i.toString()]);
          if (result) return result;
        }
      }
      if (cycleThrough) {
        for (const prop of cycleThrough) {
          const result = getPropThroughDOM(el[prop], [...path, prop]);
          if (result) return result;
        }
      }
      return undefined;
    };

    try {
      if (!this.element) return undefined;
      return getPropThroughFiber(this.fiber.memoizedProps, [])
        ?? getPropThroughDOM(this.element, []);
    } catch (err) {
      console.error(err, this);
      return undefined;
    }
  }
  // same as prop<T>(key: string) but returns the parent of the found property
  public propsWith<T>(key: string, ...cycleThrough: Array<string>): [prop: T, path: Array<string>] | undefined {
    const [prop, path] = this.prop<T>(key, ...cycleThrough);
    if (prop === undefined) return [undefined, undefined];
    const parent = path.reduce((obj, prop) => {
      return obj[prop];
    }, this.fiber.memoizedProps);
    return [parent, path.slice(0, -1)];
  }
  public propFromParent<T>(key: string, ...cycleThrough: Array<string>): [prop: T, path: Array<string>] | undefined {
    if (!this.element || !this.fiber) return [undefined, undefined];

    const getProp = (obj: Fiber, path: Array<string>) => {
      if (obj === undefined || obj === null) return undefined;
      else if (obj[key]) return [obj[key], path];

      if (obj.return) {
        const result = getProp(obj.return, [...path, 'return']);
        if (result) return result;
      }
      if (obj.memoizedProps) {
        const result = getProp(obj.memoizedProps, [...path, 'memoizedProps']);
        if (result) return result;
      }
      if (obj.pendingProps) {
        const result = getProp(obj.pendingProps, [...path, 'pendingProps']);
        if (result) return result;
      }
      if (cycleThrough) {
        for (const prop of cycleThrough) {
          const result = getProp(obj[prop], [...path, prop]);
          if (result) return result;
        }
      }
      return undefined;
    };

    try {
      return getProp(this.fiber.return, []) ?? [undefined, undefined];
    }
    catch (err) {
      console.error(err, this);
      return [undefined, undefined];
    }
  }

  public attr<
    KeyExists extends boolean = true,
    ValueExists extends boolean = false
  >(key?: string, value?: string, remove?: boolean): If<KeyExists, If<ValueExists, this, string>, Array<Attr>> {
    if (!this.element) return this as any;

    if (!key) return [...this.element.attributes] as any;
    if (value === undefined && remove === undefined) return this.element.getAttribute(key) as any;
    if (remove) {
      this.element.removeAttribute(key);
      return this as any;
    }

    this.element.setAttribute(key, value);
    return this as any;
  }

  public unmount() {
    this.element.remove();
  }

  public get hidden() {
    return this.element.hidden;
  }
  public get visible() {
    return !this.hidden;
  }

  public hide() {
    this.element.style.display = 'none';
  }
  public show() {
    this.element.style.display = '';
  }

  public appendHtml(html: string): DQuery<El> {
    this.element.appendChild(createElement(html));
    return this;
  }
  public appendElements(elements: Array<DQuery<HTMLElement>>): DQuery<El>;
  public appendElements(elements: Array<HTMLElement>): DQuery<El>;
  public appendElements(elements: Array<HTMLElement | DQuery<HTMLElement>>): DQuery<El> {
    elements.forEach(element => {
      this.element.appendChild(element instanceof DQuery ? element.element : element);
    });
    return this;
  }
  public appendComponent(component: JSX.Element, wrapperProps?: any): DQuery<El> {
    const wrapper = this.element.appendChild(createElement("<></>", wrapperProps)) as HTMLElement;
    BdApi.ReactDOM.render(component, wrapper);
    return this;
  }

  public replaceWithComponent(component: JSX.Element): DQuery<El> {
    try {
      BdApi.ReactDOM.render(component, this.element);
    } catch {}
    return this;
  }

  public insertComponent(position: InsertPosition, component: JSX.Element): DQuery<El> {
    this.element.insertAdjacentElement(position, createElement("<></>"));
    const wrapper = this.parent.children("> .bdd-wrapper", true).element as HTMLElement;

    BdApi.ReactDOM.render(component, wrapper);
    return this;
  }

  public prependHtml(html: string): DQuery<El> {
    this.element.insertAdjacentHTML('afterbegin', html);
    return this;
  }
  public prependComponent(component: JSX.Element): DQuery<El> {
    this.element.insertAdjacentElement('afterbegin', createElement("<></>"));
    const wrapper = this.element.firstChild as HTMLElement;

    BdApi.ReactDOM.render(component, wrapper);
    return this;
  }

  public on<E extends keyof HTMLElementEventMap>(event: E, listener: (this: DQuery<El>, ev: HTMLElementEventMap[E]) => any | Promise<any>, options?: AddEventListenerOptions): DQuery<El> {
    this.element.addEventListener(event, listener.bind(this), options);
    return this;
  }
  public off<E extends keyof HTMLElementEventMap>(event: E, listener: (this: DQuery<El>, ev: HTMLElementEventMap[E]) => any | Promise<any>): DQuery<El> {
    this.element.removeEventListener(event, listener);
    return this;
  }

  public async forceUpdate() {
    return Utils.forceFullRerender(getFiber(this.element));
    // return BdApi.ReactUtils.getOwnerInstance(this.element).forceUpdate();
  }
}
export default $;

export function createElement(html: string | '<></>' | 'fragment' | keyof HTMLElementTagNameMap, props: Record<string, any> = {}, target?: Selector): HTMLElement {
  if (html === "<></>" || html.toLowerCase() === "fragment") {
    if ('className' in props) props.class = `bdd-wrapper ${props.className}`;
    else props.class = 'bdd-wrapper';
    html = `<div ${Object.entries(props).reduce((result, [key, value]) => {
      if (key === 'className') return result;
      return result + `${key}="${value}" `;
    }, "")}></div>`;
  }

  const element = (() => {
    if (html.startsWith('<')) {
      const element = new DOMParser().parseFromString(html, "text/html").body.firstElementChild as HTMLElement;
      // element.classList.add("bdd-wrapper");
      return element;
    }
    return Object.assign(document.createElement(html), props);
  })();

  if (!target) return element;
  if (target instanceof Node) return target.appendChild(element);
  else if (target instanceof DQuery) return target.element.appendChild(element);
  else if (typeof target === "string" || target instanceof ElementSelector || typeof target === 'function')
    return document.querySelector(typeof target === 'function' ? target(new ElementSelector(), $).toString() : target.toString()).appendChild(element);
}