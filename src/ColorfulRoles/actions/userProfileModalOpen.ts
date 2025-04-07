import { ActionsEmitter } from "@actions";
import applyRoleColors from "src/ColorfulRoles/utils/applyRoleColors";

export default function onUserProfileModalOpen() {
  ActionsEmitter.on('USER_PROFILE_MODAL_OPEN', ({ guildId }) => {
    if (guildId) applyRoleColors();
  });
}