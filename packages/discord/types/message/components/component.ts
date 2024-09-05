export type BaseComponent<Type extends number> = {
  type: Type;
  [key: string]: any;
};

export enum Components {
  ActionRow = 1,
  Button,
  SelectMenu,
  TextInput,
}