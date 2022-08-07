import { React } from 'discordium';
import { Update } from '@discordium/api/settings';
import Discord from 'danho-discordium/components/Discord';

const { SwitchItem, TextInput } = Discord;
// const { Flex, Button, Switch, SwitchItem, TextInput, margins } = Modules;
// const { FormSection, FormTitle, FormItem, FormText, FormDivider } = Modules.Form;
const { useState } = React;

type SettingProps<Settings extends Record<string, any>> = {
    key: keyof Settings,
    value: Settings[keyof Settings],
    set: (settings: Update<Settings>) => void,
    onChange?: (value: Settings[keyof Settings]) => void,
    titles: Record<keyof Settings, string>,
}
export function Setting<Settings>({ key, value, set, onChange, titles }: SettingProps<Settings>) {
    const [v, setV] = useState(value);

    switch (typeof value) {
        case 'boolean': return <SwitchItem key={key.toString()} title={titles[key.toString()]} value={v as any} onChange={checked => {
            set({ [key]: checked } as any);
            onChange?.(checked as any);
            setV(checked as any);
        }} />;
        case 'number':
        case 'string': return <TextInput key={key.toString()} title={titles[key]} value={v as any} onChange={value => {
            set({ [key]: value } as any);
            onChange?.(value as any);
            setV(value as any);
        }} />;
        default: return (
            <div className='settings-error'>
                <h1>Unknown value type</h1>
                <h3>Recieved {typeof value}</h3>
                <h5>{JSON.stringify(value)}</h5>
            </div>
        )
    }
}
export default Setting;