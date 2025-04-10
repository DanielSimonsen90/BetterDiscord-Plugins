import { React } from "@dium";
import { Text } from "@dium/components";
import { GuildMemberStore, GuildStore, PresenceStore } from "@stores";

import { $ } from "@danho-lib/DOM";
import { GuildUtils } from "@danho-lib/Utils";

const HEADER_MEMBERS_CLASSNAME = 'danho-lib__header-members';

export default function updateHeader() {
  let showGuildMembers = $(`.${HEADER_MEMBERS_CLASSNAME}`, false);
  if (showGuildMembers.length >= 1) return;

  const guild = GuildStore.getGuild(GuildUtils.currentId);
  if (!guild) return;

  const members = GuildMemberStore.getMembers(guild.id);
  const presenceState = PresenceStore.getState();
  const nonOfflineMembers = members.filter(member => presenceState.statuses[member.userId] && presenceState.statuses[member.userId] !== 'offline');
  const header = $(s => s.className('container', 'nav').and.ariaLabel(`${guild.name} (server)`)
    .className('header', 'header'));
  if (!header) return;

  header.appendComponent(
    <Text variant="heading-md/normal">{nonOfflineMembers.length}/{members.length}</Text>,
    { className: HEADER_MEMBERS_CLASSNAME }
  );

  setTimeout(() => {
    showGuildMembers = $(`.${HEADER_MEMBERS_CLASSNAME}`, false);
    if (showGuildMembers.length > 1) {
      showGuildMembers.shift();
      showGuildMembers.forEach(e => e.unmount());
    }
  }, 100);
}

export function unmountMembersCount() {
  $(`.${HEADER_MEMBERS_CLASSNAME}`, false).forEach(e => e.unmount());
}