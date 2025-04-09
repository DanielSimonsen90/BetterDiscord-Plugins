import React from '@react';
import { Logger } from '@dium';

import { buildTextItemElement, PatchChannelContextMenu } from "@danho-lib/ContextMenus";
import { ContextMenuUtils } from "@danho-lib/Utils";

import { LockedChannelsStore } from 'src/LockChannels/stores';
import { ChannelLockModalContent } from 'src/LockChannels/components';

export default function patchChannelContextMenu() {
  PatchChannelContextMenu((menu, { channel }) => {
    const channelManagement = ContextMenuUtils.getGroupContaining('delete-channel', menu);
    if (!channelManagement) return Logger.warn('Could not find channel management group in context menu (looked for "delete-channel")', { menu });

    const { name: channelName, id: channelId } = channel;
    const lockingOption = LockedChannelsStore.isLocked(channelId) ? undefined : buildTextItemElement(
      'danho-lock-channel',
      'Lock Channel',
      () => BdApi.UI.showConfirmationModal(
        `Locking #${channelName}`,
        <ChannelLockModalContent channel={channel} />,
        {
          confirmText: `Lock #${channelName}`,
          onConfirm: () => LockedChannelsStore.lock(channelId),
          onCancel: () => LockedChannelsStore.setLockState(channelId, undefined, true),
        }
      ),
      {
        danger: true
      }
    );
    const deletingOption = LockedChannelsStore.isLocked(channelId) || !LockedChannelsStore.hasLock(channelId)
      ? undefined
      : buildTextItemElement(
        'danho-delete-lock',
        'Delete Lock',
        () => BdApi.UI.showConfirmationModal(
          `Deleting lock on #${channelName}`,
          `Are you sure you want to delete the lock on #${channelName}?`,
          {
            confirmText: 'Delete Lock',
            onConfirm: () => LockedChannelsStore.deleteLock(channelId),
          }
        ),
        {
          danger: true
        }
      );

    channelManagement.push(...[lockingOption, deletingOption].filter(Boolean));
  });
}