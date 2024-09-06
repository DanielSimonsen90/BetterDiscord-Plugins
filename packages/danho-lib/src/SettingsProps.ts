import { Setter } from '@dium/settings';

type SettingsProps<Settings> = Settings & {
    defaults: Settings,
    set: Setter<Settings>;
}
export default SettingsProps;