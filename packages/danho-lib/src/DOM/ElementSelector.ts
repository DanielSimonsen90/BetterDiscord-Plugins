import type { AriaRole } from "react";
import { If } from "../Utils/types";

export class ElementSelector {
  public static getElementFromReactInstance<Element extends HTMLElement, Multiple extends boolean = false>(instance: React.ReactElement, allowMultiple: Multiple = false as Multiple): If<Multiple, Array<Element>, Element> {
    return getElementFromReactInstance<Element, Multiple>(instance, allowMultiple);
  }
  public static getSelectorFromElement<El extends Element>(element: El): string {
    const selector = new ElementSelector().tagName(element.tagName.toLowerCase() as keyof HTMLElementTagNameMap).and;
    if (element.id) selector.id(element.id).and;
    if (element.className) selector.className(element.className).and;
    if (element.getAttribute("aria-label")) selector.ariaLabel(element.getAttribute("aria-label")).and;
    if (element.getAttribute("role")) selector.role(element.getAttribute("role") as AriaRole).and;
    if ('dataset' in element && element.dataset instanceof DOMStringMap) {
      for (const prop in element.dataset) {
        selector.data(prop, element.dataset[prop]).and;
      }
    }
    return selector.toString();
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

  public ariaLabel(label?: string, tagName?: keyof HTMLElementTagNameMap) {
    this.result += `${tagName ?? ''}${label ? `[aria-label="${label}"]` : '[aria-label]'} `;
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
  public lastChild(tagName?: keyof HTMLElementTagNameMap) {
    this.result += `${tagName ?? ''}:last-child `;
    return this;
  }

  public get and() {
    this.result = this.result.substring(0, this.result.length - 1);
    return this;
  }
  public data(prop: string, value?: string) {
    this.result += `[data-${prop}${value ? `="${value}"` : ''}] `;
    return this;
  }
  public dataIncludes(prop: string, value: string) {
    this.result += `[data-${prop}*="${value}"] `;
    return this;
  }
  public role(role: AriaRole, tagName?: keyof HTMLElementTagNameMap) {
    this.result += `${tagName ?? ''}[role="${role}"] `;
    return this;
  }
  public type(type: string, tagName?: keyof HTMLElementTagNameMap) {
    this.result += `${tagName ?? ''}[type="${type}"] `;
    return this;
  }
  public nth(index: number) {
    this.result += `:nth-child(${index}) `;
    return this;
  }

  public has(callback: (selector: ElementSelector) => ElementSelector) {
    this.result += `:has(${callback(new ElementSelector()).toString()}) `;
    return this;
  }

  public toString() {
    return this.result;
  }
}
export default ElementSelector;

export function getElementFromReactInstance<Element extends HTMLElement, Multiple extends boolean = false>(instance: React.ReactElement, allowMultiple: Multiple = false as Multiple): If<Multiple, Array<Element>, Element> {
  const selector = new ElementSelector();
  if (instance.type && !instance.type.toString().includes("function")) selector.tagName(instance.type.toString() as keyof HTMLElementTagNameMap).and;
  if (instance.props) {
    const { props } = instance;
    if (props.id) selector.id(props.id).and;
    if (props.className) selector.className(props.className).and;
    if (props.ariaLabel) selector.ariaLabel(props.ariaLabel).and;
    if (props.role) selector.role(props.role).and;
    if (props.data) {
      for (const prop in props.data) {
        selector.data(prop, props.data[prop]).and;
      }
    }
  }

  // console.log(selector.toString());

  return allowMultiple ?
    document.querySelectorAll(selector.toString()) as any :
    document.querySelector(selector.toString()) as any;
}