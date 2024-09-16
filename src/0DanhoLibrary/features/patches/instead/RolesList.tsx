import { Patcher } from "@dium/api";
import { RolesListModule } from "../../pretty-roles/types";
import { PrettyRolesManager } from "../../pretty-roles/manager";

export default function insteadRolesList(RolesListModule: RolesListModule) {
  Patcher.instead(RolesListModule, 'RolesList', ({ args, original }) => {
    const result = original(...args);
    PrettyRolesManager.context = result.props.children.props;
    return result;
  });
}