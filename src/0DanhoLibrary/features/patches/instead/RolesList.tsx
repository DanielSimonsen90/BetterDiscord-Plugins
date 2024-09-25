import { Patcher } from "@dium/api";
import { PrettyRolesManager } from "../../pretty-roles/manager";
import RolesListModule from "@danho-lib/Patcher/RolesList";

export default function insteadRolesList() {
  Patcher.instead(RolesListModule, 'RolesList', ({ args, original }) => {
    const result = original(...args);
    PrettyRolesManager.context = result.props.children.props;
    return result;
  });
}