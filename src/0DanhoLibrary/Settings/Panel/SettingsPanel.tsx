import { React, Setting, TabBar } from "@react";
import { FormSection } from "@dium/components";

import { Settings, titles } from "../Settings";

import { SettingProps } from "./_CreateSettingsGroup";
import PrettyRolesSettings from "./PrettyRolesSettings";
import BadgesSettings from "./BadgesSettings";
import AutoCancelFriendRequestSettings from "./AutoCancelFriendRequestSettings";
import LockSettings from "./LockSettings";

export default function SettingsPanel() {
  const [settings, set] = Settings.useState();
  const tabs = Settings.useSelector(({ prettyRoles, badges, autoCancelFriendRequests }) => [
    ['prettyRoles', prettyRoles ? 'Pretty Roles' : null],
    ['badges', badges ? 'Badges' : null],
    ['autoCancelFriendRequests', autoCancelFriendRequests ? 'Auto Cancel Friend Requests' : null],
    ['lockChannels', settings.lockChannels ? 'Lock Channels' : null],
  ] as Array<[string, string]>);
  const settingProps: SettingProps = { settings, set, titles };

  return (
    <div className="danho-plugin-settings">
      <FormSection title="Danho Library Features">
        <Setting setting="prettyRoles" {...settingProps} />
        <Setting setting="badges" {...settingProps} />
        <Setting setting="pronounsPageLinks" {...settingProps} />
        <Setting setting="allowForumSortByAuthor" {...settingProps} />
        <Setting setting="expandBioAgain" {...settingProps} />
        <Setting setting="wakeUp" {...settingProps} />
        <Setting setting="autoCancelFriendRequests" {...settingProps} />
        <Setting setting="showGuildMembersInHeader" {...settingProps} />
        <Setting setting="addToDungeon" {...settingProps} />
        <Setting setting="lockChannels" {...settingProps} />
        <Setting setting="nonObnoxiousProfileEffects" {...settingProps} />
      </FormSection>
      {tabs.some(([_, value]) => value) && (
        <TabBar tabs={tabs}
          prettyRoles={<PrettyRolesSettings {...settingProps} />}
          badges={<BadgesSettings {...settingProps} />}
          autoCancelFriendRequests={<AutoCancelFriendRequestSettings {...settingProps} />}
          lockChannels={<LockSettings {...settingProps} />}
        />
      )}
    </div>
  );
}