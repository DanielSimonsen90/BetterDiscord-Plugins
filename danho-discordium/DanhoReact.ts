import $, { DQuery, Selector } from "./dquery";
import ElementSelector from "./ElementSelector";

export function createElement(html: string, target?: Selector): Element {
    if (html === "<></>" || html.toLowerCase() === "fragment") {
        html = `<div class="fragment"></div>`;
    }

    const element = new DOMParser().parseFromString(html, "text/html").body.firstElementChild as Element;
    if (!target) return element;

    if (target instanceof Node) return target.appendChild(element);
    else if (target instanceof DQuery) return target.element.appendChild(element);
    else if (typeof target === "string" || target instanceof ElementSelector || typeof target === 'function') 
        return document.querySelector(typeof target === 'function' ? target(new ElementSelector(), $).toString() : target.toString()).appendChild(element);
}