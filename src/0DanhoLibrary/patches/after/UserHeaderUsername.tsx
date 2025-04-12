import { UserHeaderUsernameModule } from "@danho-lib/Patcher/UserHeaderUsername";
import { Patcher } from "@dium";
import appendUserTimezone from "src/0DanhoLibrary/features/discord-enhancements/user-timezone/appendUserTimezone";
import { Settings } from "src/0DanhoLibrary/Settings";

export default function afterUserHeaderUsername() {
  Patcher.after(UserHeaderUsernameModule, 'Z', data => {
    if (Settings.current.showUserTimezone) appendUserTimezone(data);
  }, { name: 'UserHeaderUsernameModule' });
}