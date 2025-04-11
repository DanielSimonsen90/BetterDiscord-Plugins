import { UserStatusActions } from "@actions";
import { UserUtils } from "@danho-lib/Utils";

import { Settings } from "../settings";

export default function handleHiding() {
  const status = UserUtils.me.status;
  const isHiding = status === 'invisible';
  const { isHidingOnPurpose } = Settings.current;
  
  if (isHidingOnPurpose && !isHiding) Settings.update({ isHidingOnPurpose: false });
  else if (!isHidingOnPurpose && isHiding) {
    const close = BdApi.UI.showNotice(`You appear to be hiding... Is this on purpose?`, {
      buttons: [
        {
          label: 'Yes, stay hidden',
          onClick: () => {
            Settings.update({ isHidingOnPurpose: true });
            close();
          }
        },
        {
          label: 'No, get me back online',
          onClick: () => {
            if (!UserStatusActions.dispatch) return BdApi.UI.showToast('Could not find dispatcher', { type: 'error' });
            UserStatusActions.dispatch('online', status, undefined, undefined);
            close();
          }
        },
      ]
    });
  }
  // isHidingOnPurpose && status === 'invisible' || !isHidingOnPurpose && status !== 'invisible'
}