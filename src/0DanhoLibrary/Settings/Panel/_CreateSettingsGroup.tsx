import { ErrorBoundary, React, Setting } from "@react";
import { Settings, titles } from "../Settings";
import { Setter } from "@dium/settings";
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
    const element = callback(React, props, Setting, FormElements);
    return (
      <ErrorBoundary>
        {element}
      </ErrorBoundary>
    )
  }
}