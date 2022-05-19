import Clickable from './Clickable';
import CollapseContainer from './CollapseContainer';
import ColorPicker from '../ColorPicker';
import ColorSwatches from './ColorSwatches';
import DateInput from './DateInput';
import SettingsItem from './SettingsItem';
import SettingsSaveItem from './SettingsSaveItem';
import SettingsPanel from './SettingsPanel';
import Switch from './Switch';
import TextInput from './TextInput';
import TooltipContainer from './TooltipContainer';

export type LibraryComponents = {
    Clickable: Clickable,
    CollapseContainer: CollapseContainer,
    ColorPicker: ColorPicker,
    ColorSwatches: ColorSwatches,
    DateInput: DateInput,
    // EmojiPickerButton ln. 6050
    SettingsItem: SettingsItem,
    SettingsPanel: SettingsPanel,
    SettingsSaveItem: SettingsSaveItem,
    Switch: Switch,
    TextInput: TextInput,
    TooltipContainer: TooltipContainer
}
export default LibraryComponents;