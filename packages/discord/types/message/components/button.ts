import type { Emoji } from "../../guild/emoji";
import type { BaseComponent } from "./component";

enum ButtonStyles {
  Primary = 1,
  Secondary = 2,
  Success = 3,
  Danger = 4,
  Link = 5,
}

export type Button = BaseComponent<2> & {
  style: ButtonStyles,
  label?: string,
  emoji?: Emoji,
  custom_id?: string,
  url?: string,
  disabled?: boolean;
};