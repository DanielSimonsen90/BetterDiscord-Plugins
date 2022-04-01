import {SettingsProps, React, Modules} from 'discordium';
import {Setting} from 'danho-bd';

const {Flex, Button, Text, Switch, SwitchItem, TextInput, Slider} = Modules;
const {FormSection, FormTitle, FormItem, FormText, FormDivider} = Modules.Form;
// const SelectTempWrapper = Finder.byName("SelectTempWrapper");

export const DEFAULT_SETTINGS = {
    rename: {
        enabled: new Setting(true, "Rename Discord's default strings"),
        botTag: new Setting('Bot', `The BOT tag string`),
        serverTag: new Setting('Server', `The SERVER tag string`),
        systemTag: new Setting('Discord', `The SYSTEM tag string`),
        publicGuildPolicyAccept: new Setting(`I havent read the terms but get out of my way.`, `Public Guild Policy Accept`),
        statusDND: new Setting('Do not D-Sturb', `Do not Disturb`),
        statusIDLE: new Setting('AFK', `Idle`),
        statusONLINE: new Setting('Available', `Online`),
    },
    fakeServers: {
        showFakeVerified: new Setting(true, `Show fake verified servers`),
        showFakePartnered: new Setting(true, `Show fake partnered servers`),
    },
    developer: {
        showMessagesInConsole: new Setting(false, `Show Discord's default messages in console`),
        clearConsoleOnLoad: new Setting(true, `Clear the console when loading the plugin`)
    }
}

export type SettingsPanelProps = SettingsProps<typeof DEFAULT_SETTINGS>;
export const SettingsPanel = ({ set, rename, fakeServers, developer }: SettingsPanelProps): JSX.Element => (<>
    
</>);