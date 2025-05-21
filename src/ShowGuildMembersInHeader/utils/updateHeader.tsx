import { React } from "@dium";
import { Text } from "@dium/components";
import { GuildMemberCountStore, GuildStore } from "@discord/stores";

import { $ } from "@dom";
import { GuildUtils } from "@utils";

const HEADER_MEMBERS_CLASSNAME = 'danho-lib__header-members';

export default function updateHeader() {
  let showGuildMembers = $(`.${HEADER_MEMBERS_CLASSNAME}`, false);
  if (showGuildMembers.length) showGuildMembers.forEach(e => e.unmount());

  const guild = GuildStore.getGuild(GuildUtils.currentId);
  if (!guild) return;

  const onlineCount = GuildMemberCountStore.getOnlineCount(guild.id);
  const memberCount = GuildMemberCountStore.getMemberCount(guild.id);
  const header = $(s => s.className('container', 'nav').and.ariaLabel(`${guild.name} (server)`)
    .className('header', 'header'));
  if (!header) return;

  header.appendComponent(
    <Text variant="heading-md/normal">{onlineCount}/{memberCount}</Text>,
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