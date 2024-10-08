import { React, useState } from '../React';
import { Update } from '@dium/settings';
import { FormSwitch, FormText, TextInput } from '@discord/components';

type SettingProps<Settings extends Record<string, any>, SettingsKey extends keyof Settings> = {
  setting: SettingsKey,
  settings: Settings,
  set: (settings: Update<Settings>) => void,
  titles: Record<keyof Settings, string>,

  beforeChange?: (value: Settings[SettingsKey]) => Settings[SettingsKey],
  onChange?: (value: Settings[SettingsKey]) => void,
  formatValue?: (value: Settings[SettingsKey]) => Settings[SettingsKey],
  type?: 'switch' | 'text' | 'number' | React.HTMLInputTypeAttribute;
};
export function Setting<
  Settings,
  SettingsKey extends keyof Settings
>({
  setting, settings,
  set, titles,
  ...props
}: SettingProps<Settings, SettingsKey>) {
  const { beforeChange, onChange, formatValue, type } = props;
  const [v, _setV] = useState(formatValue ? formatValue(settings[setting]) : settings[setting]);
  const setV = (value: Settings[SettingsKey]) => _setV(formatValue ? formatValue(value) : value);

  if (type === undefined ? typeof v === 'boolean' : type === 'switch') return (
    <FormSwitch className='danho-form-switch' key={setting.toString()} note={titles[setting.toString()]} value={Boolean(v)} hideBorder
      onChange={inputValue => {
        const checked = beforeChange ? beforeChange(inputValue as Settings[SettingsKey]) : inputValue;
        set({ [setting]: checked } as any);
        onChange?.(checked as any);
        setV(checked as any);
      }}
    />
  );
  if (type === undefined ? typeof v === 'number' : type === 'number') return (
    <div className="setting-group">
      <TextInput key={setting.toString()} value={v as string} onChange={inputValue => {
        const value = beforeChange ? beforeChange(Number(inputValue) as Settings[SettingsKey]) : Number(inputValue);
        set({ [setting]: value } as any);
        onChange?.(value as any);
        setV(value as any);
      }} />
      <FormText className='note'>{titles[setting]}</FormText>
    </div>
  );
  if (type === undefined ? typeof v === 'string' : type === 'text') return (
    <div className="setting-group">
      <TextInput key={setting.toString()} value={v as string} onChange={inputValue => {
        const value = beforeChange ? beforeChange(inputValue as Settings[SettingsKey]) : inputValue;
        set({ [setting]: value } as any);
        onChange?.(value as any);
        setV(value as any);
      }} />
      <FormText className='note'>{titles[setting]}</FormText>
    </div>
  );
  if (type) return (
    <div className="danho-form-switch" key={setting.toString()}>
      <input type={type} key={setting.toString()} value={v as string} onChange={e => {
        const value = beforeChange ? beforeChange(e.target.value as Settings[SettingsKey]) : e.target.value;
        set({ [setting]: value } as any);
        onChange?.(value as any);
        setV(value as any);
      }} />
      <FormText className='note'>{titles[setting]}</FormText>
    </div>
  );

  return (
    <div className='settings-error'>
      <h1>Unknown value type</h1>
      <h3>Recieved {typeof v}</h3>
      <h5>{JSON.stringify(v)}</h5>
    </div>
  );
}
export default Setting;