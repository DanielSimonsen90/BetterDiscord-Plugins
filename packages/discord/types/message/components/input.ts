import type { BaseComponent } from "./component";

enum TextInputStyles {
  Short = 1,
  Paragraph = 2,
}

export type TextInput = BaseComponent<4> & {
  custom_id?: string,
  style: TextInputStyles,
  label: string,
  value: string,
  min_length?: number,
  max_length?: number,
  required?: boolean,
  placeholder?: string,
};