import { React, Modules } from 'discordium';
import { Update } from '@discordium/api/settings';
import { Settings, titles } from '../../Settings/types';

const { Flex, Button, Switch, SwitchItem, TextInput, margins } = Modules;
const { FormSection, FormTitle, FormItem, FormText, FormDivider } = Modules.Form;
const { useState } = React;

type SettingProps = {
    key: keyof Settings,
    value: Settings[keyof Settings],
    set: (settings: Update<Settings>) => void,
    onChange?: (value: Settings[keyof Settings]) => void,
}
export default function Setting({ key, value, set, onChange }: SettingProps) {
    const [v, setV] = useState(value);

    switch (typeof value) {
        case 'boolean': return <SwitchItem key={key} title={titles[key]} value={v} onChange={(checked: boolean) => {
            set({ [key]: checked });
            onChange?.(checked);
            setV(checked);
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