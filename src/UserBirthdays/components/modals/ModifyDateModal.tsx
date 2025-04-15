import { UserUtils, ClassNamesUtils } from '@danho-lib/Utils';
import { Button } from '@discord/components';
import React, {
  classNames,
  EmptyFormGroup, Modal, SearchableList, UserListItem,
  useState
} from '@react';
import { UserStore } from '@stores';

type BirthdateData = {
  userId?: string;
};

type Props = {
  open: boolean;
  onClose(): void;

  date: string;
  onSubmit(data: BirthdateData): void;
};

export function ModifyDateModal({
  open, onClose,
  date, onSubmit
}: Props) {
  const [form, setForm] = useState<BirthdateData>({});
  if (!date) return null;

  return (
    <Modal open={open} onClose={onClose}
      title={`Add a birthday to ${new Date(date).toDateString()}`} 
      className="modify-date-modal"
    >
      <form className='modify-date-form' onSubmit={e => {
        e.preventDefault();
        onSubmit(form);
      }}>
        <EmptyFormGroup label='Birthday user' name="userId">
          {ref => (
            <SearchableList ref={ref}
              items={UserUtils.getUsersPrioritizingFriends()}
              onSearch={(search, user) => UserUtils.getUsernames(user, true).some(u => u.includes(search.toLowerCase()))}
              renderItem={user => (
                <UserListItem user={user} 
                  className={classNames(form.userId === user.id && "border-success")}
                  onClick={() => setForm(state => ({ ...state, userId: user.id }))} 
                />
              )}
            />
          )}
        </EmptyFormGroup>
        <div className="button-panel">
          <Button type='button' look={Button.Looks.OUTLINED} className={ClassNamesUtils.ColorClassNames.colorDefault} onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' look={Button.Looks.FILLED} disabled={!form.userId}>
            {form.userId 
              ? `Add ${UserUtils.getUsernames(UserStore.getUser(form.userId)).shift()}'s birthday to ${new Date(date).toDateString()}` 
              : 'Add birthday'
            }
          </Button>
        </div>
      </form>
    </Modal>
  );
}