import Finder from "@danho-lib/dium/api/finder";
import { Snowflake, User } from "@discord/types";
import { Store } from "@dium/modules/flux";

export type UserStore = Store & {
  filter(predicate: (user: User) => boolean): User[];
  findByTag(username: string): User | undefined
  /** @deprecated -- Discord moved away from discriminator numbers, but some users may not be up to date. */
  findByTag(username: string, discriminator: string): User | undefined
  forEach(callback: (user: User) => void): void;
  getCurrentUser(): User;
  getUser(id: Snowflake): User | undefined;
  getUsers(): Record<Snowflake, User>;
}

export const UserStore: UserStore = Finder.byName("UserStore");
export default UserStore;