import { React } from '@react';
import { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import UserActivityStatus from "@danho-lib/Patcher/UserActivityStatus";
import { StringUtils } from "@danho-lib/Utils";
import { ActivityIndexes } from "@discord/types";
import { Logger } from '@danho-lib/dium/api/logger';

export default createPatcherAfterCallback<UserActivityStatus>(({ result, args: [props] }) => {
  if (props.activity.type !== ActivityIndexes.LISTENING) return;

  const {
    details: title,
    state: artistsString,
  } = props.activity;

  const artists = StringUtils.join(artistsString.split(";"));

  try {
    const children = result.props.children[1].props.children;
    children[1] = typeof children[1] !== 'object' ? children[1] : (
      <span>
        <strong>{title}</strong> by <strong>{artists}</strong>
      </span>
    ) as any;
  } catch (err) {
    Logger.error(err, {
      result, props, title, artists,
    });
  }
});