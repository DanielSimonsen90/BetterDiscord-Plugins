import type { Emoji } from "../../guild/emoji";
import type { BaseComponent } from "./component";

export type SelectMenu = BaseComponent<3> & {
  custom_id?: string,
  options: Array<{
    label: string,
    value: string,
    description?: string,
    emoji?: Emoji,
    default?: boolean,
  }>;
  placeholder?: string,
  min_values?: number,
  max_values?: number,
  disabled?: boolean;
};