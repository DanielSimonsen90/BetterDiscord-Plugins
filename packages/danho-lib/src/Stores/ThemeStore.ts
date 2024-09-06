import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export type Theme = 'dark' | 'light';

export interface ThemeStore extends Store {
    get theme(): Theme;

    getState(): Record<'theme', Theme>;
    __getLocalVars(): LocalVars;
}

type LocalVars = Record<`${'default' | 'lastComputed'}Theme` | 'systemPrefersColorScheme' | 'theme', Theme> & {
    useForcedColors: boolean;
}
export const ThemeStore: ThemeStore = Finder.byKeys(["theme"]);
export default ThemeStore;