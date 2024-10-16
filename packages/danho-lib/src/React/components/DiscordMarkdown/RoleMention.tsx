import { Snowflake } from '@discord/types';
import { React } from '../../React';
import { GuildUtils } from '@danho-lib/Utils';

type Props = {
  id: Snowflake;
  onClick?: (event: React.MouseEvent) => void;
}

export function RoleMention({ id, onClick }: Props) {
  const role = GuildUtils.getGuildRoleWithoutGuildId(id);
  return <span className="role-mention" style={{ backgroundColor: role.colorString }} onClick={onClick}>{role.name}</span>;
}


export default RoleMention;