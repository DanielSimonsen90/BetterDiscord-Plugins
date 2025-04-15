import { UserUtils, ClassNamesUtils } from '@danho-lib/Utils';
import { Button } from '@discord/components';
import { User } from '@discord/types';
import { Text } from '@dium/components';
import React, { Modal } from '@react';

type Props = {
  open: boolean;
  onClose(): void;

  user: User;
  onSubmit(): void;
};

export function MarkedUserModal({
  open, onClose, 
  user, onSubmit
}: Props) {

  if (!user) return null;
  const displayName = UserUtils.getUsernames(user).shift();

  return (
    <Modal open={open} onClose={onClose}
      title={`Remove ${displayName}'s birthday?`} 
      className="marked-user-modal"
    >
      <form className='marked-user-form' onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}>
        <Text variant='text-md/normal'>Are you sure you want to remove {displayName}'s birthday?</Text>
        <Text variant='text-sm/medium'>You will need to add their birthday back to their User note again, if you change your mind.</Text>

        <div className="button-panel">
          <Button type='button' look={Button.Looks.OUTLINED} className={ClassNamesUtils.ColorClassNames.colorDefault} onClick={onClose}>
            Keep {displayName}'s birthday
          </Button>
          <Button type='submit' look={Button.Looks.FILLED} color={Button.Colors.RED}>
            Remove {displayName}'s birthday
          </Button>
        </div>
      </form>
    </Modal>
  );
}