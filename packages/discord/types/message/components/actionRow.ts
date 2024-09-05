import type { BaseComponent } from "./component";

export type ActionRow = BaseComponent<1> & {
  components: Array<BaseComponent<number>>;
};