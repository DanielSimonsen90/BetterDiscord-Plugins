import { Dispatch, SetStateAction } from "@react";

import { UserStore, RelationshipStore } from "@discord/stores";
import { Snowflake, User } from "@discord/types";

import { Logger } from "@dium";

import { UserNoteActions } from "@actions";
import { DanhoStores, DiumStore } from "@stores";
import { DateFormat, TimeUtils, UserUtils } from "@utils";

import { BIRTHDAY_REGEX, getBirthdate } from "../utils/constants";
import { Settings } from "../settings/Settings";

type BirthdayStoreState = {
  birthdays: Record<Snowflake, string>;
  page: {
    modifyDate?: string | null;	
    modifyUser?: User | null;	
    markedUser?: User | null;	
    currentDate?: Date | null;
    show?: boolean;
  }
}

export type PageState = BirthdayStoreState['page'];

const BirthdayStore = new class BirthdayStore extends DiumStore<BirthdayStoreState> {
  constructor() {
    super({
      birthdays: {},
      page: {}
    }, 'BirthdayStore', () => {
      // Reset date stage on reload
      this.current.page.currentDate = new Date();
      
      // this.loadFriendNotes()
    });
  }

  public get dateFormat() {
    return Settings.current.dateFormat as DateFormat;
  }

  public getSortedBirthdays() {
    return Object
      .entries(this.current.birthdays)
      .sort(([_, a], [__, b]) => {
        const now = new Date();
        const dateA = new Date(a);
        dateA.setFullYear(now.getFullYear());

        const dateB = new Date(b);
        dateB.setFullYear(now.getFullYear());

        return dateA.getTime() - dateB.getTime();
      })
      .map(([userId, birthdate]) => {
        const birthdateDate = new Date(birthdate);

        return ({
          user: UserStore.getUser(userId),
          unix: TimeUtils.getUnixTime(birthdateDate),
          date: birthdateDate,
          string: `${String(birthdateDate.getMonth() + 1).padStart(2, '0')}-${String(birthdateDate.getDate()).padStart(2, '0')}`,
          turningAge: new Date().getFullYear() - birthdateDate.getFullYear()
        })
      });
  }

  public isBirthdayChild(userResolvable: User | Snowflake) {
    const user = typeof userResolvable === 'object' ? userResolvable : UserStore.getUser(userResolvable);
    if (!user) {
      Logger.warn(`User not found for ${userResolvable}`);
      return false;
    }

    const date = this.current.birthdays[user.id] ? new Date(this.current.birthdays[user.id]) : null;
    if (!date) return false; // No birthday set

    const now = new Date();
    const sameDay = date.getDate() === now.getDate();
    const sameMonth = date.getMonth() === now.getMonth();
    return sameDay && sameMonth;
  }

  public getBirthdateFromNote(note: string, userId: Snowflake): string | null {
    const match = note.match(BIRTHDAY_REGEX);
    if (!match) return null;

    const [birthdate] = match;
    const stored = this.getUserBirthdate(userId);

    if (!stored || stored.toString() !== getBirthdate(birthdate).toString()) {
      this.setUserBirthdate(userId, getBirthdate(birthdate).toString());
      Logger.log(`[BirthdayStore] Added birthday for ${userId}`);
    }

    return this.getUserBirthdate(userId).toString();
  }
  public getUserBirthdate(userId: Snowflake) {
    const birthdate = this.current.birthdays[userId];
    return birthdate ? new Date(birthdate) : null;
  }

  public setBirthday(userId: Snowflake, birthday: Date) {
    return this.setUserBirthdate(userId, birthday.toString());
  }
  private setUserBirthdate(userId: Snowflake, birthdate: string) {
    this.update(current => ({
      ...current,
      birthdays: {
        ...current.birthdays,
        [userId]: birthdate,
      }
    }));
  }

  public removeUserBirthday(userId: Snowflake) {
    this.update(current => {
      const { [userId]: _, ...birthdays } = current.birthdays;
      return {
        ...current,
        birthdays
      };
    });
  }

  public usePageState(): [BirthdayStoreState['page'], (page: SetStateAction<BirthdayStoreState['page']>) => void] {
    const [state, setState] = this.useState();
    return [state.page, (page: SetStateAction<BirthdayStoreState['page']>) => {
      const newState = typeof page === 'function' ? page(state.page) : page;
      setState(current => ({
        ...current,
        page: {
          ...current.page,
          ...newState,
        }
      }));
    }] as const;
  }
  public usePageStateSelector<TKey extends keyof PageState, TValue extends PageState[TKey]>(
    selector: TKey
  ): [TValue, Dispatch<SetStateAction<TValue>>] {
    const [state, setState] = this.useState();
    const selectedValue = state.page[selector] as TValue;

    return [
      selectedValue,
      (value: SetStateAction<TValue>) => {
        setState(current => {
          const newValue: TValue = typeof value === 'function' 
            ? (value as SetStateAction<any>)(selectedValue) 
            : value;
            
          return {
            ...current,
            page: {
              ...current.page,
              [selector]: newValue,
            }
          };
        });
      }
    ];
  }

  public async loadFriendNotes() {
    Logger.groupCollapsed('BirthdayStore.loadFriendNotes()');
    const friendIds = RelationshipStore.getFriendIDs();
    for (let i = 0; i < friendIds.length; i++) {
      const userId = friendIds[i];
      const displayName = UserUtils.getDisplayName(UserStore.getUser(userId));
      Logger.log(`Loading friendNotes for ${displayName} (${i + 1}/${friendIds.length})`);
      if (this.getUserBirthdate(userId)) {
        Logger.log(`Birthday already set for ${displayName} - skipping`);
        continue;
      }
      
      const note = await UserNoteActions.getOrRequestNote(userId);
      if (note) this.getBirthdateFromNote(note, userId);
      else Logger.log(`No note found for ${displayName}`);
      await TimeUtils.wait(1000); // Prevent rate limiting
    }

    Logger.log('Finished loading friendNotes');
    Logger.groupEnd();
  }
};

DanhoStores.register(BirthdayStore);

export default BirthdayStore;