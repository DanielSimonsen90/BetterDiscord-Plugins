import { Arrayable } from 'danholibraryjs';
import { ReactDOM, Utils } from 'discordium'
import ElementSelector from './ElementSelector';
import { If, PromisedReturn } from './Utils';
import { Fiber } from '@react';

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
    >(selector: Selector<El>, single: Single = true as Single): If<Single, DQuery<T>, Array<DQuery<T>>> {
    if (single) return new DQuery(selector as Selector<T>) as any;

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
    })()

    return elements.map(el => new DQuery<T>(el)) as any;
}
export async function $p<
    Single extends boolean = true,
    T extends HTMLElement = HTMLElement,
    El extends Single extends true ? T : Array<T> = Single extends true ? T : Array<T>,
    >(selector: PromisedReturn<SelectorCallback<El>>, single: Single = true as Single): Promise<If<Single, DQuery<T>, Array<DQuery<T>>>> {
    const resolved = await selector(new ElementSelector(), $);

    if (single) return new DQuery(resolved as T) as any;

    let elements = (() => {
        if (resolved instanceof ElementSelector || typeof resolved === 'string')
            return [...document.querySelectorAll<T>(resolved.toString()).values()] as Array<T>;
        else if (resolved instanceof DQuery) {
            return [resolved.element] as Array<T>;
        }
        return (Array.isArray(resolved) ? resolved : [resolved]) as Array<T>;
    })()

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
    public set style(value: CSSStyleDeclaration) {
        for (const key in value) {
            this.element.style[key] = value[key];
        }
    }

    public addClass(className: string) {
        this.element.classList.add(className);
        return this;
    }
    public removeClass(className: string) {
        this.element.classList.remove(className);
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
        if (!selector) return single ? new DQuery<El>(this.element.children[0] as El) : [...this.element.children].map(child => new DQuery<El>(child as El)) as any;

        selector = typeof selector === 'function' ? selector(new ElementSelector(), $) as El : selector;

        if (typeof selector === 'string' || selector instanceof ElementSelector) {
            const elements = this.element.querySelectorAll(selector.toString());
            return single ? new DQuery<El>(elements[0] as El) : [...elements.values()].map(child => new DQuery<El>(child as El)) as any;
        }

        const getElement = (element: Element): El => {
            const childrenArray = [...element.children];
            if (childrenArray.some(child => child === selector)) return element as El;

            for (const child of childrenArray) {
                const result = getElement(child);
                if (result) return result;
            }
            return undefined;
        }
        return getElement(this.element) ? new DQuery<El>(getElement(this.element) as El) as any : undefined;
    }
    public get firstChild() {
        return this.children()[0];
    }
    public get lastChild() {
        const children = this.children();
        return children[children.length - 1];
    }

    public get fiber() {
        return this.element['__reactFiber$'] as Fiber;
    }
    public get props() {
        try {
            return this.fiber.memoizedProps as Record<string, any>;
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
        const getProp = (obj: Record<string, Partial<Record<'props' | 'children' | string, any>>>, path: Array<string>) => {
            if (obj === undefined || obj === null) return undefined;
            else if (obj[key]) return [obj[key], path];

            if (obj.children) {
                if (Array.isArray(obj.children)) {
                    for (let i = 0; i < obj.children.length; i++) {
                        const result = getProp(obj.children[i], [...path, `children`, i.toString()]);
                        if (result) return result;
                    }
                } else {
                    const result = getProp(obj.children, [...path, 'children']);
                    if (result) return result;
                }
            }
            if (obj.props) {
                const result = getProp(obj.props, [...path, 'props']);
                if (result) return result;
            }
            if (cycleThrough) {
                for (const prop of cycleThrough) {
                    const result = getProp(obj[prop], [...path, prop]);
                    if (result) return result;
                }
            }
            return undefined;
        }

        try {
            return getProp(this.fiber.memoizedProps, []) ?? [undefined, undefined];
        } catch (err) {
            console.error(err, this);
            return [undefined, undefined];
        }
    }
    // same as prop<T>(key: string) but returns the parent of the found property
    public propsWith<T>(key: string, ...cycleThrough: Array<string>): [prop: T, path: Array<string>] | undefined {
        const [prop, path] = this.prop<T>(key, ...cycleThrough);
        if (prop === undefined) return [undefined, undefined];
        const parent = path.reduce((obj, prop) => {
            return obj[prop];
        }, this.fiber.memoizedProps);
        return [parent, path.slice(0, -1)]
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
        }

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
    >(key?: string, value?: string): If<KeyExists, If<ValueExists, this, string>, Array<Attr>> {
        if (!key) return [...this.element.attributes] as any
        if (value === undefined) return this.element.getAttribute(key) as any;
        this.element.setAttribute(key, value);
        return this as any;
    }

    public unmount() {
        this.element.remove();
    }

    public appendHtml(html: string): DQuery<El> {
        this.element.appendChild(createElement(html));
        return this;
    }
    public appendComponent(component: JSX.Element): DQuery<El> {
        this.element.appendChild(createElement("<></>"));
        const wrapper = this.element.lastChild as HTMLElement;

        ReactDOM.render(component, wrapper);
        return this;
    }

    public replaceComponent(component: JSX.Element): DQuery<El> {
        ReactDOM.render(component, this.element);
        return this;
    }

    public insertComponent(position: InsertPosition, component: JSX.Element): DQuery<El> {
        this.element.insertAdjacentElement(position, createElement("<></>"));
        const wrapper = this.parent.children(".bdd-wrapper", true).element as HTMLElement;

        ReactDOM.render(component, wrapper);
        return this;
    }

    public prependHtml(html: string): DQuery<El> {
        this.element.insertAdjacentHTML('afterbegin', html);
        return this;
    }
    public prependComponent(component: JSX.Element): DQuery<El> {
        this.element.insertAdjacentElement('afterbegin', createElement("<></>"));
        const wrapper = this.element.firstChild as HTMLElement;

        ReactDOM.render(component, wrapper);
        return this;
    }

    public on<E extends keyof HTMLElementEventMap>(event: E, listener: (this: DQuery<El>, ev: HTMLElementEventMap[E]) => any | Promise<any>): DQuery<El> {
        this.element.addEventListener(event, listener.bind(this));
        return this;
    }
    public off<E extends keyof HTMLElementEventMap>(event: E, listener: (this: DQuery<El>, ev: HTMLElementEventMap[E]) => any | Promise<any>): DQuery<El> {
        this.element.removeEventListener(event, listener);
        return this;
    }

    public async forceUpdate() {
        return Utils.forceFullRerender(this.fiber);
    }
}
export default $;

export function createElement(html: string | '<></>' | 'fragment', target?: Selector): Element {
    if (html === "<></>" || html.toLowerCase() === "fragment") {
        html = `<div class="bdd-wrapper"></div>`;
    }

    const element = new DOMParser().parseFromString(html, "text/html").body.firstElementChild as Element;
    if (!target) return element;

    if (target instanceof Node) return target.appendChild(element);
    else if (target instanceof DQuery) return target.element.appendChild(element);
    else if (typeof target === "string" || target instanceof ElementSelector || typeof target === 'function')
        return document.querySelector(typeof target === 'function' ? target(new ElementSelector(), $).toString() : target.toString()).appendChild(element);
}