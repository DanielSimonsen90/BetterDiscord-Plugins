import { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import NameTag from "@danho-lib/Patcher/NameTag";
import BirthdayStore from "../BirthdayStore";
import { React } from '@react';
import { Logger } from "@dium";
import { Tooltip } from "@discord/components";
import { UserStore } from "@danho-lib/Stores";

export default createPatcherAfterCallback<NameTag>(({ result: _result, args: [props] }) => {
  const result = _result as any as ReturnType<typeof _result>;
  if (!props.avatar.props.src) return result;

  // userId: src: https://cdn.discordapp.com/avatars/<userId>/<avatar>.webp
  const USER_AVATAR_ID_REGEX = /\/avatars\/(\d+)\//;
  const userId = props.avatar.props.src.match(USER_AVATAR_ID_REGEX)?.[1];
  if (!userId) return result;

  const user = UserStore.getUser(userId);
  if (!user) return result;

  const isBirthdayChild = BirthdayStore.isBirthdayChild(user);
  if (!isBirthdayChild) return result;

  result.props.children[0].props.children = [
    result.props.children[0].props.children,
    <Tooltip text={`It's ${user.globalName ?? user.username}'s birthday!`}>
      {props => <span {...props} className="birthday-child-icon">🎂</span>}
    </Tooltip>
  ] as any;
});