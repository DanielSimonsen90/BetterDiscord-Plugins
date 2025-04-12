import { DanhoStores, DiumStore } from "@stores";
import { Snowflake, User } from "@discord/types";
import { Logger } from "@dium";
import { UserStore } from "@dium/modules";

const BirthdayStore = new class BirthdayStore extends DiumStore<Record<Snowflake, string>> {
  constructor() {
    super({}, 'BirthdayStore');
  }

  public isBirthdayChild(userResolvable: User | Snowflake) {
    const user = typeof userResolvable === 'object' ? userResolvable : UserStore.getUser(userResolvable);
    if (!user) {
      Logger.warn(`User not found for ${userResolvable}`);
      return false;
    }

    const date = this.current[user.id] ? new Date(this.current[user.id]) : null;
    if (!date) return false; // No birthday set

    const now = new Date();
    const sameDay = date.getDate() === now.getDate();
    const sameMonth = date.getMonth() === now.getMonth();
    return sameDay && sameMonth;
  }
}

DanhoStores.register(BirthdayStore);

export default BirthdayStore;