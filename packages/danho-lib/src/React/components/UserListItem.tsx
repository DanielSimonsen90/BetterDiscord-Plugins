import { User } from "@discord/types";
import { MouseEvent, React, ReactNode } from "../React";
import { classNames } from "../utils";
import { Text } from "@dium/components";
import { UserUtils } from "@utils";

type Props = {
  user: User;

  children?: ((user: User, TextComponent: typeof Text) => ReactNode) | ReactNode;
  className?: string;
  onClick?: (user: User) => void;
  onContextMenu?: (e: MouseEvent) => void;

  openModalOnClick?: boolean;
};

export function UserListItem(props: Props) {
  const {
    user,
    children, className, onClick,
    openModalOnClick
  } = props;

  const handleClick = () => {
    if (onClick) onClick(user);
    if (openModalOnClick) UserUtils.openModal(user.id);
  };

  return (
    <div className={classNames("danho-discord-user", onClick && 'clickable', className)}
      onClick={handleClick}
      onContextMenu={props.onContextMenu}
    >
      <img src={user.getAvatarURL()} alt={user.username} className="danho-discord-user__avatar" />
      <section className="danho-discord-user__info">
        <Text variant="text-md/bold" className="danho-discord-user__displayName">{user.globalName ?? user.username}</Text>
        {user.globalName && <Text variant="text-sm/normal" className="danho-discord-user__username">{user.username}</Text>}
        {children ? typeof children === "function" ? children(user, Text) : children : null}
      </section>
    </div>
  );
};