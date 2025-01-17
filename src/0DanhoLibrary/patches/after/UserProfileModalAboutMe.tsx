import { Logger } from "@danho-lib/dium/api/logger";
import UserProfileModalAboutMe from "@danho-lib/Patcher/UserProfileModalAboutMe";
import { Patcher } from "@dium";
import prettifyRoles from "src/0DanhoLibrary/features/style-changes/pretty-roles/patches/prettifyRoles";
import { Settings } from "src/0DanhoLibrary/Settings";

export default async function afterUserProfileModalAboutMe() {
  if (!Settings.current.prettyRoles) return;
  
  UserProfileModalAboutMe.then(module => {
    if (!module) return Logger.error('UserProfileModalAboutMe module not found');
    Patcher.after(module, 'Z', () => {
      if (Settings.current.prettyRoles) prettifyRoles()
    }, { name: 'UserProfileModalAboutMe' });
  });
}