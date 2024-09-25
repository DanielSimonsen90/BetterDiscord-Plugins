import { React } from "@dium/modules";
import { Settings, titles } from "../Settings";
import { Setter } from "@dium/settings";
import { Setting } from "@danho-lib/React";
import * as FormElements from "@dium/components/form";

export type SettingProps = {
  settings: typeof Settings.current,
  set: Setter<typeof Settings.current>,
  titles: typeof titles,
};

export default function CreateSettingsGroup(callback: (
  react: typeof React, 
  settingsProps: SettingProps,
  setting: typeof Setting,
  formElements: typeof FormElements
) => JSX.Element) {
  return function SettingsGroup(props: SettingProps) {
    const { FormDivider } = FormElements;
    const children = callback(React, props, Setting, FormElements);

    return (<>
      <FormDivider />
      {children}
    </>)
  }
}