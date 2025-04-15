import React, { useState } from '@react';
import { FormItemFromModel, Modal } from '@components';

import { Button } from '@discord/components';
import { User } from '@discord/types';

import { UserUtils, ClassNamesUtils } from '@utils';

type Form = {
  day: number;
  month: number;
  year: number;
};

type BirthdateData = {
  birthdate: Date;
};

type Props = {
  open: boolean;
  onClose(): void;

  date: Date,
  user: User;
  onSubmit(data: BirthdateData): void;
};

export function ModifyUserModal({
  open, onClose,
  date, user, onSubmit
}: Props) {
  const [form, setForm] = useState<Form>({
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  });

  if (!user) return null;
  const displayName = UserUtils.getUsernames(user).shift();

  return (
    <Modal open={open} onClose={onClose}
      title={`Edit ${displayName}'s birthday`}
      className="modify-user-modal"
    >
      <form className='modify-user-form' onSubmit={e => {
        e.preventDefault();
        onSubmit({
          birthdate: new Date(form.year, form.month - 1, form.day)
        });
      }}>
        <FormItemFromModel model={form} property='day' onModelChange={model => setForm(model)} min={1} max={31} />
        <FormItemFromModel model={form} property='month' onModelChange={model => setForm(model)} min={1} max={12} />
        <FormItemFromModel model={form} property='year' onModelChange={model => setForm(model)} min={1900} max={new Date().getFullYear()} />

        <div className="button-panel">
          <Button type='button' look={Button.Looks.OUTLINED} className={ClassNamesUtils.ColorClassNames.colorDefault} onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' look={Button.Looks.FILLED}>
            {`Edit ${displayName}'s birthday`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}