import { DiscordTimeFormat } from "@discord/types";
import CreateSettingsGroup from "../../_CreateSettingsGroup";
import TimestampComponent from "@discord/components/Timestamp";
import { Settings } from "src/0DanhoLibrary/Settings/Settings";

export default CreateSettingsGroup((React, props, Setting) => {
  const settings = Settings.useSelector(s => ({
    timestampStyle: s.birthdateTimestampStyle as DiscordTimeFormat
  }))

  return (<>
    <Setting setting="hideBirthdateIcon" {...props} />
    <Setting setting="hideBirthdateTimestamp" {...props} />
    <Setting setting="birthdateTimestampStyle" {...props} type="select" selectValues={[
      "D", "d",
      "T", "t",
      "F", "f",
      "R"
    ] as Array<DiscordTimeFormat>} />
    <TimestampComponent format={settings.timestampStyle} unix={Date.now() / 1000} />
  </>);
})