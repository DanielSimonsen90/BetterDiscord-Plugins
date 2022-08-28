import { Finder } from "@discordium/api";
import { Store } from "@discordium/modules/flux";

export type Theme = 'dark' | 'light';

export interface ThemeStore extends Store {
    get theme(): Theme;

    getState(): Record<'theme', Theme>;
    __getLocalVars(): LocalVars;
}

type LocalVars = Record<`${'default' | 'lastComputed'}Theme` | 'systemPrefersColorScheme' | 'theme', Theme> & {
    useForcedColors: boolean;
}
export const ThemeStore: ThemeStore = Finder.byProps("theme");
export default ThemeStore;