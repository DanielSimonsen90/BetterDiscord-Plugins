import { BaseComponent } from './component';

import { ActionRow } from './actionRow';
import { Button } from './button';
import { SelectMenu } from './selectMenu';
import { TextInput } from './input';

export type ComponentTypes = {
  1: ActionRow,
  2: Button,
  3: SelectMenu,
  4: TextInput,
  [number: number]: BaseComponent<number>;
};