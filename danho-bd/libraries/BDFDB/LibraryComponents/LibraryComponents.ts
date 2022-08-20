import Clickable from './Clickable';
import CollapseContainer from './CollapseContainer';
import ColorPicker from '../ColorPicker';
import ColorSwatches from './ColorSwatches';
import DateInput from './DateInput';
import SettingsItem from './SettingsItem';
import SettingsSaveItem from './SettingsSaveItem';
import SettingsPanel from './SettingsPanel';
import SvgIcon from './SvgIcon';
import Switch from './Switch';
import TextInput from './TextInput';
import TooltipContainer from './TooltipContainer';
import EmojiPickerButton from './EmojiPickerButton';
import PopoutContainer from './PopoutContainer';

export type LibraryComponents = {
    Clickable: Clickable,
    CollapseContainer: CollapseContainer,
    ColorPicker: ColorPicker,
    ColorSwatches: ColorSwatches,
    DateInput: DateInput,
    EmojiPickerButton: EmojiPickerButton,
    // FavButton ln: 6206
    PopoutContainer: PopoutContainer,
    SettingsItem: SettingsItem,
    SettingsSaveItem: SettingsSaveItem,
    SettingsPanel: SettingsPanel,
    SvgIcon: SvgIcon,
    Switch: Switch,
    TextInput: TextInput,
    TooltipContainer: TooltipContainer
} & {
    [key: string]: () => JSX.Element
}
export default LibraryComponents;