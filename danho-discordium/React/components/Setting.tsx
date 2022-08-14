import { React } from '@discordium/modules';
import { Update } from '@discordium/api/settings';
import { SwitchItem, TextInput } from './Discord';

// const { Flex, Button, Switch, SwitchItem, TextInput, margins } = Modules;
// const { FormSection, FormTitle, FormItem, FormText, FormDivider } = Modules.Form;
const { useState } = React;

type SettingProps<Settings extends Record<string, any>> = {
    setting: keyof Settings,
    settings: Settings,
    set: (settings: Update<Settings>) => void,
    onChange?: (value: Settings[keyof Settings]) => void,
    titles: Record<keyof Settings, string>,
}
export function Setting<Settings>({ setting, settings, set, onChange, titles }: SettingProps<Settings>) {
    const [v, setV] = useState(settings[setting]);
    console.log({ setting, settings, v, titles })

    switch (typeof v) {
        case 'boolean': return <SwitchItem key={setting.toString()} title={titles[setting.toString()]} value={v as any} onChange={checked => {
            set({ [setting]: checked } as any);
            onChange?.(checked as any);
            setV(checked as any);
        }} />;
        case 'number':
        case 'string': return <TextInput key={setting.toString()} title={titles[setting]} value={v as any} onChange={value => {
            set({ [setting]: value } as any);
            onChange?.(value as any);
            setV(value as any);
        }} />;
        default: return (
            <div className='settings-error'>
                <h1>Unknown value type</h1>
                <h3>Recieved {typeof v}</h3>
                <h5>{JSON.stringify(v)}</h5>
            </div>
        )
    }
}
export default Setting;