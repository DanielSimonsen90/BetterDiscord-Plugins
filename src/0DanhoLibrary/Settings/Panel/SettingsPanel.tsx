import { React, Setting, TabBar } from "@react";
import { FormSection } from "@dium/components";

import { Settings, titles } from "../Settings";

import { SettingProps } from "./_CreateSettingsGroup";
import StyleSettings from "./StyleSettings";
import BadgesSettings from "./BadgesSettings";
import AutoCancelFriendRequestSettings from "./AutoCancelFriendRequestSettings";
import LockSettings from "./LockSettings";

export default function SettingsPanel() {
  const [settings, set] = Settings.useState();
  const tabs = Settings.useSelector(({ styleChanges, badges, autoCancelFriendRequests, lockChannels }) => [
    ['autoCancelFriendRequests', autoCancelFriendRequests ? 'Auto Cancel Friend Requests' : null],
    ['badges', badges ? 'Badges' : null],
    ['lockChannels', lockChannels ? 'Lock Channels' : null],
    ['styleChanges', styleChanges ? 'Style Changes' : null],
  ] as Array<[string, string]>);
  const settingProps: SettingProps = { settings, set, titles };

  return (
    <div className="danho-plugin-settings">
      <FormSection title="Danho Library Features">
        <Setting setting="styleChanges" {...settingProps} />
        <Setting setting="badges" {...settingProps} />
        <Setting setting="allowForumSortByAuthor" {...settingProps} />
        <Setting setting="wakeUp" {...settingProps} />
        <Setting setting="autoCancelFriendRequests" {...settingProps} />
        <Setting setting="showGuildMembersInHeader" {...settingProps} />
        <Setting setting="addToDungeon" {...settingProps} />
        <Setting setting="lockChannels" {...settingProps} />
      </FormSection>
      {tabs.some(([_, value]) => value) && (
        <TabBar tabs={tabs}
          styleChanges={<StyleSettings {...settingProps} />}
          badges={<BadgesSettings {...settingProps} />}
          autoCancelFriendRequests={<AutoCancelFriendRequestSettings {...settingProps} />}
          lockChannels={<LockSettings {...settingProps} />}
        />
      )}
    </div>
  );
}