import { ActionsEmitter } from "@actions";
import { Settings } from "../Settings";
import prettifyRoles from "src/0DanhoLibrary/features/style-changes/pretty-roles/patches/prettifyRoles";

export default function onRelationshipAdd() {
  if (!Settings.current.prettyRoles) return;

  ActionsEmitter.on('USER_PROFILE_MODAL_OPEN', ({ guildId }) => {
    if (Settings.current.prettyRoles && guildId) prettifyRoles();
  });
}