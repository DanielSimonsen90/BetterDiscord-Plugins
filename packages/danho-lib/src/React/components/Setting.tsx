import { React } from '@dium/modules';
import { Update } from '@dium/settings';
import { FormSwitch, TextInput } from '@discord/components';

const { useState } = React;

type SettingProps<Settings extends Record<string, any>> = {
    setting: keyof Settings,
    settings: Settings,
    set: (settings: Update<Settings>) => void,
    onChange?: (value: Settings[keyof Settings]) => void,
    titles: Record<keyof Settings, string>,
};
export function Setting<Settings>({ setting, settings, set, onChange, titles }: SettingProps<Settings>) {
    const [v, setV] = useState(settings[setting]);

    switch (typeof v) {
        case 'boolean': return <FormSwitch className='danho-form-switch' key={setting.toString()} note={titles[setting.toString()]} value={v} hideBorder onChange={checked => {
            set({ [setting]: checked } as any);
            onChange?.(checked as any);
            setV(checked as any);
        }} />;
        case 'number':
        case 'string': return <TextInput key={setting.toString()} title={titles[setting]} value={v as string} onChange={value => {
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
        );
    }
}
export default Setting;