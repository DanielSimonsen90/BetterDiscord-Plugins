import React from '../../React';
import { UserStore } from "@discord/stores";
import { Snowflake } from "@discord/types";

type Props = {
  id: Snowflake;
  onClick?: (event: React.MouseEvent) => void;
}

export function UserMention({ id, onClick }: Props) {
  const user = UserStore.getUser(id);
  return (
    <span className="mention interactive user-mention" onClick={onClick}>
      {user.globalName ?? user.username}
    </span>
  );
}

export default UserMention;