import Finder from '../Injections/finder';
import { UserStatus } from "@discord/types";

type StatusDispatcher = (to: UserStatus, from: UserStatus, n: undefined, u: undefined) => Promise<void>;
export const dispatch = Finder.bySourceStrings<StatusDispatcher>('getStatus()', 'updateAsync("status",');

export const UserStatusActions = {
  dispatch,
}

export default UserStatusActions;