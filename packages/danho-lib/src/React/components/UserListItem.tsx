import { Snowflake, User } from "@discord/types";
import { GuildMemberStore, PresenceStore, VoiceStore } from "@discord/stores";
import { UserActivity, UserAvatar, Text, AvatarWithText, UserPopout } from '@discord/components';
import { MouseEvent, React, ReactNode, PropsWithChildren, useMemo, useState } from "../React";
import { classNames } from "../utils";
import { ClassNamesUtils, GuildUtils, UserUtils } from "@utils";

type Props = {
  user: User;

  children?: ((user: User, TextComponent: typeof Text) => ReactNode) | ReactNode;
  className?: string;
  onClick?: (user: User) => void;
  onContextMenu?: (e: MouseEvent) => void;

  openModalOnClick?: boolean;
  openPopoutOnClick?: boolean;
  showGuildProfile?: boolean;

  showStatus?: boolean;
  showActivity?: boolean;
  roleColorId?: Snowflake;
};

export function UserListItem(props: Props) {
  const {
    user,
    children, className, onClick,
    openModalOnClick, openPopoutOnClick,
    showGuildProfile, showActivity, showStatus, roleColorId
  } = props;
  const roleColor = useMemo(() => roleColorId ? GuildUtils.getGuildRoleWithoutGuildId(roleColorId)?.colorString : undefined, [roleColorId]);

  const handleClick = () => {
    if (onClick) onClick(user);
    if (openModalOnClick) UserUtils.openModal(user.id, showGuildProfile);
  };

  const Container = ({ children }: PropsWithChildren) => {
    const [showPopout, setShowPopout] = useState(false);

    return openPopoutOnClick ? (
      <UserPopout clickTrap={showPopout} shouldShow={showPopout} onRequestClose={() => setShowPopout(false)}
        guildId={GuildUtils.currentId} position="left" roleId={GuildMemberStore.getMember(GuildUtils.currentId, user.id)?.hoistRoleId}
        spacing={16} user={user} shouldShowStatus={showStatus}
      >
        {props => <div {...props} onClick={e => {
          props.onClick(e);
          setShowPopout(v => !v);
        }} className="popout-inner">{children}</div>}
      </UserPopout>
    ) : (<>{children}</>);
  };

  return (
    <Container>
      <div className={classNames("danho-discord-user", onClick && 'clickable', className)}
        onClick={handleClick}
        onContextMenu={props.onContextMenu}
      >
        <AvatarWithText
          avatar={<UserAvatar
            status={showStatus ? PresenceStore.getStatus(user.id) : undefined}
            size='SIZE_32'
            src={user.getAvatarURL()}
            imageClassName="danho-discord-user__avatar"
          />}
          name={<Text
            variant="text-md/bold"
            className="danho-discord-user__displayName"
            style={{ color: roleColor }}
          >
            {user.globalName ?? user.username}
          </Text>}
          subText={<>
            {!showActivity
              ? user.globalName && <Text variant="text-sm/normal" className="danho-discord-user__username">{user.username}</Text>
              : <UserActivity 
                  activities={PresenceStore.getActivities(user.id, GuildUtils.currentId).concat(PresenceStore.getActivities(user.id))} 
                  user={user} 
                  animate 
                  voiceChannel={VoiceStore.getVoiceStateForUser(user.id)?.channelId} 
                  textClassName={ClassNamesUtils.ColorClassNames.colorDefault}
                />
            }
            {children ? typeof children === "function" ? children(user, Text) : children : null}
          </>}
        />

        {/* <section className="danho-discord-user__info">

        </section> */}
      </div>
    </Container>
  );
};