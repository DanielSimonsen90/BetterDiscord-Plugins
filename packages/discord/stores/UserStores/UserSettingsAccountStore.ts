import type { Snowflake, User } from "@discord/types";

import { Finder } from "@injections";
import { Store }from '@dium/modules/flux';

type Profile = Pick<User, 'bio' | 'banner' | 'accentColor'> & {
    pronouns: string;
    themeColors: any;
}
type UserSettingsProfile = Profile & Pick<User, 'avatar'> & {
    avatarDecoration: string;
}

export type UserSettingsAccountStore = Store & {
    [key in `setPending${Capitalize<keyof UserSettingsProfile>}`]: (value: UserSettingsProfile[keyof UserSettingsProfile]) => void;
} & {
    getAllPending(): UserSettingsProfile;
    getErrors(): {};
    getFormState(): FormStates;
    isDisableSubmit(): boolean;
    showNotice(): void;
}
export const UserSettingsAccountStore = Finder.byName<UserSettingsAccountStore>("UserSettingsAccountStore");

export type UserProfileSettingsStore = {
    [key in `setPending${Capitalize<keyof Profile>}`]: (value: Profile[keyof Profile]) => void;
} & {
    resetPendingProfileChanges(): void;
    saveProfileChanges(changes: Partial<Profile>, guildId?: Snowflake): void;
};
export const UserProfileSettingsStore = Finder.byKeys(["saveProfileChanges", "setPendingBio"]);

type BetterProfileSettings = UserProfileSettingsStore & UserSettingsAccountStore;
export const BetterProfileSettings: BetterProfileSettings = {
    ...Finder.byKeys(["saveProfileChanges", "setPendingBio"]),
    ...Finder.byName("UserSettingsAccountStore")
}
export default BetterProfileSettings;

enum FormStates {
    OPEN = "OPEN",
    SUBMITTING = "SUBMITTING",
    CLOSED = "CLOSED"
}