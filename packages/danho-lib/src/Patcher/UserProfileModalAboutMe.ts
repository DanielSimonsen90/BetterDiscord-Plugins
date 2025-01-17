import Finder from "@danho-lib/dium/api/finder";

export type UserProfileModalAboutMe = { Z: Function; };
export const UserProfileModalAboutMe = Finder.findBySourceStrings<UserProfileModalAboutMe>('look:"profile_modal"', 'lazy=true', { defaultExport: false });
export default UserProfileModalAboutMe;