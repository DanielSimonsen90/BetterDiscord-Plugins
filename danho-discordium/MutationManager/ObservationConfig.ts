import { Fiber } from "@react";
import $, { DQuery, Selector } from "@dquery";
import { Arrayable } from "danholibraryjs";
import { MutationConfigOptions } from "./MutationManager";

export type ConfigSelector = Exclude<Selector, DQuery | Node>;
export type ObservationCallback<Arguments extends Array<any> = Array<any>> = (record: MutationRecord, fiber: Fiber, ...args: Arguments) => boolean
export type ObservationConfigSetupCallback<
    Arguments extends Array<any> = Array<any>,
> = (this: ObservationConfig<Arguments>, record: MutationRecord, callback:  ObservationCallback<Arguments>) => void;

export class ObservationConfig<Arguments extends Array<any> = Array<any>> {
    public ready: boolean = false;
    public hasRan: boolean = false;
    public discordSelector: ConfigSelector;
    public get element() {
        return $(this.discordSelector);
    }

    constructor(
        public preferredSelector: string, 
        discordSelector: Arrayable<ConfigSelector>, 
        public setupCallback: ObservationConfigSetupCallback<Arguments>,
        public dependency?: MutationConfigOptions
    ) {
        this.discordSelector = Array.isArray(discordSelector) ? discordSelector.join(' ') : discordSelector;
    }

    public toString() {
        return `${this.discordSelector instanceof HTMLElement ? (
            `<${this.discordSelector.tagName.toLowerCase()} class="${this.discordSelector.classList.value}"${this.discordSelector.ariaLabel ? ` aria-label="${this.discordSelector.ariaLabel}"` : ''}>`
        ) : this.discordSelector.toString()} (data-mutation-manager-id="${this.preferredSelector}")`;
    }
}
export default ObservationConfig;