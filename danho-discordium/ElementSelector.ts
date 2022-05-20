import { AriaRole } from "react";

export class ElementSelector {
    public getElementFromInstance<Element extends HTMLElement>(instance: React.ReactElement) {
        return getElementFromInstance<Element>(instance);
    }

    private result = "";

    public id(id: string, tagName?: keyof HTMLElementTagNameMap) {
        this.result += `${tagName ?? ''}[id*="${id}"] `;
        return this;
    }
    public className(name: string, tagName?: keyof HTMLElementTagNameMap) {
        this.result += `${tagName ?? ''}[class*="${name}"] `;
        return this;
    }

    public ariaLabel(label: string, tagName?: keyof HTMLElementTagNameMap) {
        this.result += `${tagName ?? ''}[aria-label="${label}"] `;
        return this;
    }
    public ariaLabelContains(label: string, tagName?: keyof HTMLElementTagNameMap) {
        this.result += `${tagName ?? ''}[aria-label*="${label}"] `;
        return this;
    }

    public tagName(name: keyof HTMLElementTagNameMap) {
        this.result += `${name} `;
        return this;
    }

    public get sibling() {
        this.result += `~ `;
        return this;
    }
    public directChild(tagName?: keyof HTMLElementTagNameMap) {
        this.result += `> ${tagName ?? '*'} `;
        return this;
    }

    public get and() {
        this.result = this.result.substring(0, this.result.length - 1);
        return this;
    }
    public mutationManagerId(id: string, tagName?: keyof HTMLElementTagNameMap) {
        this.result += `${tagName ?? ''}[data-mutation-manager-id="${id}"] `;
        return this;
    }
    public data(prop: string, value?: string) {
        this.result += `[data-${prop}"${value ? `="${value}"` : ''}"] `;
        return this;
    }
    public role(role: AriaRole, tagName?: keyof HTMLElementTagNameMap) {
        this.result += `${tagName ?? ''}[role="${role}"] `;
        return this;
    }

    public toString() {
        return this.result;
    }
}
export default ElementSelector;

export function getElementFromInstance<Element extends HTMLElement>(instance: React.ReactElement): Element {
    const selector = new ElementSelector()
    if (instance.type) selector.tagName(instance.type.toString() as keyof HTMLElementTagNameMap).and;
    if (instance.props) {
        const { props } = instance;
        if (props.id) selector.id(props.id).and;
        if (props.className) selector.className(props.className).and;
        if (props.ariaLabel) selector.ariaLabel(props.ariaLabel).and;
        if (props.role) selector.role(props.role).and;
        if (props.dataMutationManagerId) selector.mutationManagerId(props.dataMutationManagerId).and;
        if (props.data) {
            for (const prop in props.data) {
                selector.data(prop, props.data[prop]).and;
            }
        }
    }

    return (
        document.querySelector<Element>(selector.toString()) 
        // ?? 
        // delay(() => getElementFromInstance(instance), 100)
    );

}