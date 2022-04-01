import { Component } from "../../React";

type SettingsPanel = Component<{
    addon?: {
        name?: string,
        children?: Array<Component> | (() => Array<Component>),
        onSettingsClosed?: () => void,
    }
}>
export default SettingsPanel;