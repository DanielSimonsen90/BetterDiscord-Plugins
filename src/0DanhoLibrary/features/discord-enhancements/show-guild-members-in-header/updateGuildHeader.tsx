import { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import MemberListItem from "@danho-lib/Patcher/MemberListItem";
import { $ } from "@danho-lib/DOM";

import { React } from '@react';
import { GuildMemberStore, GuildStore, PresenceStore } from "@stores";
import { Text } from "@dium/components";

export default createPatcherAfterCallback<MemberListItem['Z']>(({ args: [props] }) => {
  let showGuildMembers = $('.danho-lib__header-members', false);
  if (showGuildMembers.length >= 1) return;

  const guild = GuildStore.getGuild(props.guildId);
  if (!guild) return;

  const members = GuildMemberStore.getMembers(guild.id);
  const presenceState = PresenceStore.getState();
  const nonOfflineMembers = members.filter(member => presenceState.statuses[member.userId] && presenceState.statuses[member.userId] !== 'offline');
  const header = $(s => s.className('container', 'nav').and.ariaLabel(`${guild.name} (server)`)
    .className('header', 'header'));
  if (!header) return;

  header.appendComponent(
    <Text variant="heading-md/normal">{nonOfflineMembers.length}/{members.length}</Text>,
    { className: 'danho-lib__header-members' }
  );

  setTimeout(() => {
    showGuildMembers = $('danho-lib__header-members', false);
    if (showGuildMembers.length > 1) {
      showGuildMembers.shift();
      showGuildMembers.forEach(e => e.unmount());
    }
  }, 100);
});