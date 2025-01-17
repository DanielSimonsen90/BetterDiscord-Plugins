import { Logger } from "@danho-lib/dium/api/logger";
import { GuildHeader } from '@danho-lib/Patcher/GuildHeader';
import { MemberListItem } from '@danho-lib/Patcher/MemberListItem';
import { Settings } from "src/0DanhoLibrary/Settings";

export default function Feature() {
  if (!Settings.current.showGuildMembersInHeader) return;
  
  if (!GuildHeader) return Logger.error("Failed to find header memo");
  if (!MemberListItem) return Logger.error("Failed to find MemberListItem");
}