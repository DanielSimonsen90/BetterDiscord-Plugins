import Finder from "@danho-lib/dium/api/finder";
import { Logger } from "@danho-lib/dium/api/logger";
import { $ } from "@danho-lib/DOM";

import { Guild, GuildMember, Snowflake } from "@discord/types";

import { Patcher } from "@dium";
import { Text } from "@dium/components";

import { GuildMemberStore, GuildStore, PresenceStore } from "@stores";
import { React } from '@react';

type GuildHeader = {
  type: JSX.BD.FCF<{
    animatedOverlayHeight: number;
    'aria-controls': undefined;
    'aria-expanded': false;
    bannerVisible: boolean;
    children: JSX.BD.Rendered<{
      contentTypes: Array<number>;
      guild: Guild;
      renderGuildHeaderDropdownButton: () => JSX.BD.Rendered,
      theme: string;
    }>;
  }>;
};

export default function Feature() {
  const headerMemo = Finder.findBySourceStrings<GuildHeader>("hasCommunityInfoSubheader()", "ANIMATED_BANNER", "header");
  if (!headerMemo) return Logger.error("Failed to find header memo");

  const MemberListItem = Finder.findBySourceStrings("ownerTooltipText", "onClickPremiumGuildIcon:", { defaultExport: false }) as Record<'Z', JSX.BD.FCF<{
    guildId: Snowflake;
  }>>;
  if (!MemberListItem) return Logger.error("Failed to find MemberListItem");

  Patcher.after(MemberListItem, 'Z', ({ args: [props] }) => {
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
    }, 100)
  }, { name: 'GuildHeader' });
}