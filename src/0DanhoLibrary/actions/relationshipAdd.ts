import { ActionsEmitter } from "@actions";
import CancelFriendRequest from '../features/discord-enhancements/auto-cancel-friend-requests/onRelationshipAdd';
import { Settings } from "../Settings";

export default function onRelationshipAdd() {
  if (!Settings.current.autoCancelFriendRequests 
    || Settings.current.folderNames.length === 0
  ) return;

  ActionsEmitter.on('RELATIONSHIP_ADD', data => {
    if (Settings.current.autoCancelFriendRequests) CancelFriendRequest(data);
  });
}