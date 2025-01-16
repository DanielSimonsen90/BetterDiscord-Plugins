import Finder from "@danho-lib/dium/api/finder";
import { ChannelUtils, GuildUtils } from "@danho-lib/Utils";
import { Snowflake } from "@discord/types";
import { React } from "@react";

const DiscordRoleMention = Finder.findBySourceStrings(
  "roleColor:", "roleId:", "roleName:", "channelId:", "roleStyle",
) as React.FC<{
  channelId: Snowflake;
  // children: [
  //   tag: JSX.BD.Rendered<{
  //     children: `@${string}`;
  //   }>
  // ],
  // <span>@{roleName}</span>
  children: React.ReactNode,
  color: number,
  colorString: string,
  content: [{
    type: 'text',
    content: `@${string}`;
  }],
  guildId: Snowflake,
  inlinePreview?: boolean,
  roleColor: number,
  roleId: Snowflake,
  roleName: string,
  type: 'mention';
}>;

export function RoleMention({ id }: { id: Snowflake; }) {
  const role = GuildUtils.getGuildRoleWithoutGuildId(id);

  return (
    <DiscordRoleMention
      roleColor={role.color} roleId={id} roleName={role.name}
      color={role.color} colorString={`#${role.colorString}`}
      channelId={ChannelUtils.currentChannelId} guildId={GuildUtils.current?.id}
      content={[{ type: 'text', content: `@${role.name}` }]}
      type="mention"
    >
      <span>@{role.name} </span>
    </DiscordRoleMention>
  );
}

export default RoleMention;