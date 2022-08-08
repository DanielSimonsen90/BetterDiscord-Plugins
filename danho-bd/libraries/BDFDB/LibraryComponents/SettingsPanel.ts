import { ComponentClass, Children } from "@react";

type SettingsPanel = ComponentClass<{
    addon?: {
        name?: string,
        children?: Children,
        onSettingsClosed?: () => void,
    }
}>
export default SettingsPanel;