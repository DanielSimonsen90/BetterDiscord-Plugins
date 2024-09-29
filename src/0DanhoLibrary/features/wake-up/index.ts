import Finder from "@danho-lib/dium/api/finder";
import { StatusTypes } from "@danho-lib/Stores";
import { UserUtils } from "@danho-lib/Utils";
import { Settings } from "src/0DanhoLibrary/Settings";

type StatusString = 'online' | 'idle' | 'dnd' | 'invisible';
type StatusDispatcher = (to: StatusString, from: StatusString, n: undefined, u: undefined) => Promise<void>;

export default function Feature() {
  if (!Settings.current.wakeUp) return;

  const status = UserUtils.me.status;
  const isHiding = status === StatusTypes.INVISIBLE;
  const { isHidingOnPurpose } = Settings.current;
  if (isHidingOnPurpose && !isHiding) Settings.update({ isHidingOnPurpose: false });
  else if (!isHidingOnPurpose && isHiding) {
    const close = BdApi.UI.showNotice(`You appear to be hiding... Is this on purpose?`, { 
      buttons: [
        {
          label: 'Yes, stay hidden',
          onClick: () => {
            Settings.update({ isHidingOnPurpose: true })
            close();
          }
        },
        {
          label: 'No, get me back online',
          onClick: () => {
            const dispatch = Finder.findBySourceStrings('getStatus()', 'updateAsync("status",') as StatusDispatcher;
            if (!dispatch) return BdApi.UI.showToast('Could not find dispatcher', {type: 'error' });
            dispatch('online', status, undefined, undefined);
            close();
          }
        },
      ]
    })
  }
  // isHidingOnPurpose && status === StatusTypes.INVISIBLE || !isHidingOnPurpose && status !== StatusTypes.INVISIBLE
}