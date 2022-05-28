import { Setter } from '@discordium/api/settings';

type SettingsProps<Settings> = Settings & {
    defaults: Settings,
    set: Setter<Settings>;
}
export default SettingsProps;