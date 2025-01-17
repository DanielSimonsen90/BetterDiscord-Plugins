import { Patcher } from "@dium/api";
import modifyRoleContextMenu from "src/0DanhoLibrary/features/style-changes/pretty-roles/patches/modifyRoleContextMenu";
import { Settings } from "src/0DanhoLibrary/Settings";

export default function afterRoleContextMenu() {
  if (!Settings.current.prettyRoles) return;

  Patcher.contextMenu('dev-context', result => {
    if (Settings.current.prettyRoles) modifyRoleContextMenu(result);
  });
}