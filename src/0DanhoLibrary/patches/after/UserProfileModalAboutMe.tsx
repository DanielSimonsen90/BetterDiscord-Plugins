import Finder from "@danho-lib/dium/api/finder";
import { Patcher } from "@dium";
import prettifyRoles from "src/0DanhoLibrary/features/pretty-roles/patches/prettifyRoles";



export default function afterUserProfileModalAboutMe() {
  const UserProfileModalAboutMe = Finder.findBySourceStrings('look:"profile_modal"', { defaultExport: false }) as { Z: Function }
  Patcher.after(UserProfileModalAboutMe, 'Z', () => {
    prettifyRoles()
  }, { name: 'UserProfileModalAboutMe' });
}