import Component from "danho-discordium/components/Component";

type SettingsPanel = Component<{
    addon?: {
        name?: string,
        children?: Array<Component> | (() => Array<Component>),
        onSettingsClosed?: () => void,
    }
}>
export default SettingsPanel;