import SettingsSaveItem from "./SettingsSaveItem";

type SettingsItem<T = any> = SettingsSaveItem<T> & {
    mini?: boolean,
    labelClassName?: string,
    tag?: string,
    margin?: string,
    disabled?: boolean,
    id?: string,
    dividerTop?: boolean,
    dividerBottom?: boolean,
    childProps?: Omit<SettingsItem, 'childProps' | 'basis' | 'margin' | 'dividerBottom' | 'dividerTop' | 'label' | 'labelClassName' | 'tag' | 'mini' | 'note'>
    onChange?: (value: T) => void,
};
export default SettingsItem;