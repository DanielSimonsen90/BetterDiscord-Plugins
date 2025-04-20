import { Snowflake } from "@discord/types";
import { Finder } from "@injections";

type Popouts = (
  | 'avatarProfile' | 'contextMenu' | 'emojiBurstPicker' 
  | 'emojiPicker' | 'interactionAvatarProfile' | 'interactioNData' 
  | 'interactionUsernameProfile' | 'moreUtilities' | 'referencedAvatarProfile'
  | 'referencedUsernameProfile' | 'usernameProfile'
);
type usePopout = (userId: Snowflake, popouts: Record<Popouts, boolean>) => {
  popouts: Record<Popouts, boolean>;
  selected: boolean;
  setPopout: (popout: Partial<Record<Popouts, boolean>>) => void;
}

export const DefaultPopouts = Array<Popouts>(
  'avatarProfile', 'contextMenu', 'emojiBurstPicker', 
  'emojiPicker', 'interactionAvatarProfile', 'interactioNData', 
  'interactionUsernameProfile', 'moreUtilities', 'referencedAvatarProfile',
  'referencedUsernameProfile', 'usernameProfile'
).reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {} as Record<Popouts, boolean>);
export const usePopout = Finder.bySourceStrings<usePopout & { DefaultPopouts: typeof DefaultPopouts }>("requestAnimationFrame", "current");
usePopout.DefaultPopouts = DefaultPopouts;
export default usePopout;