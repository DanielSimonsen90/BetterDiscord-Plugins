import { Finder } from "@discordium/api";
import Input from "./_Input";

export type SwitchItem<Props = {
    note?: string;
    checked?: boolean;
    disabled?: boolean;
}> = Input<boolean, Props>;
export const SwitchItem: SwitchItem = Finder.byName("SwitchItem");