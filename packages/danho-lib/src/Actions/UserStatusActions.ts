import Finder from "@danho-lib/dium/api/finder";
import { UserStatus } from "@discord/types";

type StatusDispatcher = (to: UserStatus, from: UserStatus, n: undefined, u: undefined) => Promise<void>;
export const dispatch: StatusDispatcher = Finder.findBySourceStrings('getStatus()', 'updateAsync("status",') as StatusDispatcher;

export const UserStatusActions = {
  dispatch,
}

export default UserStatusActions;