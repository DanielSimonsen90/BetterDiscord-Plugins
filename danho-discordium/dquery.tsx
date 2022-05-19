import { ComponentFiber } from 'danho-bd/libraries/React';
import { Arrayable } from 'danholibraryjs';
import { ReactDOM } from 'discordium'
import { createElement } from './DanhoReact';
import ElementSelector from './ElementSelector';
import { If } from './Utils';

export type Selector<Element extends Arrayable<HTMLElement> = HTMLElement> = 
    | string 
    | Element 
    | ElementSelector 
    | (Element extends HTMLElement ? DQuery<HTMLElement> : Array<DQuery<HTMLElement>>)
    | ((selector: ElementSelector, _$: typeof $) => ElementSelector | string | DQuery<HTMLElement> | Element);

export function $<
    Single extends boolean = true,
    T extends HTMLElement = HTMLElement,
    El extends Single extends true ? T : Array<T> = Single extends true ? T : Array<T>, 
>(selector: Selector<El>, single: Single = true as Single): If<Single, DQuery<T>, Array<DQuery<T>>> {
    if (single) return new DQuery(selector as Selector<T>) as any;

    let elements = (() => {
        if (typeof selector === 'function') {
            selector = selector(new ElementSelector(), $) as Selector<El>;
            console.log('Selector called', selector)
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

export class DQuery<El extends HTMLElement = HTMLElement> {
    constructor(private selector: Selector<El>) {
        const element = (
            selector instanceof Node ? selector as El : 
            selector instanceof DQuery ? selector.element as El :
            document.querySelector<El>(
                typeof selector === 'function' ? selector(new ElementSelector(), $).toString() : 
                selector instanceof ElementSelector ? selector.toString() : selector
            )
        );
        if (!element) console.trace(`%cCould not find element with selector: ${selector}`, "color: lightred; background-color: darkred;");
        this.element = element;
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
        if ('value' in this.element) return this.element['value'];
        if ('checked' in this.element) return this.element['checked'];
        return this.element.textContent;
    }
    public get classes() {
        return this.element.classList.value;
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

    public get fiber() {
        return this.element['__reactFiber$'] as ComponentFiber<any, any>;
    }
    public get props() {
        return this.fiber.memoizedProps as Record<string, any>;
    }

    // Function should get the property that matches provided key.
    // If no property matches, it should see if object has children or props.
    // If it does, it should recurse into those.
    // Finally, it should return undefined if nothing matches.
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

        return getProp(this.fiber.memoizedProps, []) ?? [undefined, undefined];
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

    public attr<ValueExists extends boolean = false>(key: string, value?: string): If<ValueExists, string, this> {
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
        const fragment = this.element.lastChild as HTMLElement;

        ReactDOM.render(component, fragment, () => this.element.replaceChild(fragment.lastChild, fragment));
        return this;
    }
    
    public prependHtml(html: string): DQuery<El> {
        this.element.insertAdjacentHTML('afterbegin', html);
        return this;
    }
    public prependComponent(component: JSX.Element): DQuery<El> {
        this.element.insertAdjacentHTML('afterbegin', `<div class="fragment"></div>`);
        const fragment = this.element.firstChild as HTMLElement;

        ReactDOM.render(component, fragment, () => this.element.replaceChild(fragment.firstChild, fragment));
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

}
export default $;