import { Patcher } from "@dium/api";
import modifyRoleContextMenu from "src/0DanhoLibrary/features/style-changes/pretty-roles/patches/modifyRoleContextMenu";

export default function afterRoleContextMenu() {
  Patcher.contextMenu('dev-context', result => {
    return modifyRoleContextMenu(result);
  });
}