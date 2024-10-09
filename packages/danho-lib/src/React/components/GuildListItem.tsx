import { React } from '../React';
import { GuildStore } from "@stores";
import { Snowflake, Guild } from "@discord/types";

type GuildListItemProps = ({
  guildId: Snowflake;
} | {
  guild: Guild;
}) & {
  children?: React.ReactNode;
}

export function GuildListItem(props: GuildListItemProps) {
  const guildId = React.useMemo(() => 'guildId' in props ? props.guildId : props.guild.id, [props]);
  const guild = React.useMemo(() => 'guild' in props ? props.guild : GuildStore.getGuild(guildId) as any as Guild, [guildId]);
  const { children } = props;

  return (
    <div className="guild-list-item">
      <img className="guild-list-item__icon" src={window.DL.Guilds.getIconUrl(guild)} alt={guild.name} />
      <div className="guild-list-item__content-container">
        <span className="guild-list-item__name">{guild.name}</span>
        <span className="guild-list-item__content">
          {children}
        </span>
      </div>
    </div>
  );
}

export default GuildListItem;