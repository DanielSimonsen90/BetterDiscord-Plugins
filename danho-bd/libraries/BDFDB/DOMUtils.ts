export type DOMUtils = {
    getSelection(): string,
    addClass(elements: Array<HTMLElement>, ...classes: Array<string>): void
    removeClass(elements: Array<HTMLElement>, ...classes: Array<string>): void
    toggleClass(elements: Array<HTMLElement>, ...classes: Array<string>): void
    containsClass(elements: Array<HTMLElement>, ...classes: Array<string>): void
    replaceClass(elements: Array<HTMLElement>, ...classes: Array<string>): void
    formatClassName(...classes: string[]): string;
    removeClassFromDOM(...classes: Array<string>): string;
    show(...elements: Array<HTMLElement>): void;
    hide(...elements: Array<HTMLElement>): void;
    toggle(...elements: Array<HTMLElement>): void;
    isHidden(element: HTMLElement): boolean;
    remove(...elements: Array<HTMLElement>): void;
    create(html: string): HTMLElement;
    getParent(selector: string, node: HTMLElement): HTMLElement;
    setText(element: HTMLElement, text: string): void;
    getText(element: HTMLElement): string;
    getRects(element: HTMLElement): Array<DOMRect>;
    getHeight(element: HTMLElement): number;
    getInnerHeight(element: HTMLElement): number;
    getWidth(element: HTMLElement): number;
    getInnerWidth(element: HTMLElement): number;
    appendWebScript(url: string, container: HTMLElement): void;
    removeWebScript(url: string, container: HTMLElement): void;
    appendWebStyle(url: string, container: HTMLElement): void;
    removeWebStyle(url: string, container: HTMLElement): void;
    appendLocalStyle(id: string, css: string, container: HTMLElement): void;
    removeLocalStyle(id: string, container: HTMLElement): void;
}
export default DOMUtils;