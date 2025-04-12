import { React, User, classNames, useEffect } from "@react";
import { Text } from '@dium/components';
import TimestampComponent from "@discord/components/Timestamp";
import { RelationshipStore, UserNoteStore, UserStore } from "@stores";

import { BIRTHDAY_REGEX, getBirthdate } from "../utils/constants";
import { $ } from "@danho-lib/DOM";
import { ClassNameModule } from "../hooks/useBirthdayNavProps";
import { Logger } from "@dium";

type Props = {
  className?: string;
};

export default function CalendarPage({ className }: Props) {
  const friends = RelationshipStore.getFriendIDs();
  const friendBirthdays = friends
    .map(userId => Object.assign({}, UserNoteStore.getNote(userId), { userId }))
    .filter(noteState => !noteState.loading && BIRTHDAY_REGEX.test(noteState.note))
    .map(noteStateData => ({
      birthdate: getBirthdate(noteStateData.note.match(BIRTHDAY_REGEX)[0]),
      userId: noteStateData.userId
    }));

  useEffect(() => {
    const selected = $(`.${ClassNameModule.interactiveSelected}`);
    if (!selected) {
      Logger.warn(`No elements found with class ${ClassNameModule.interactiveSelected}`);
      return;
    }
    if (!selected.ancestor('.danho-birthday-calendar')) selected.removeClass(ClassNameModule.interactiveSelected);
  }, []);

  return (
    <div className={classNames('calendar-page', className)}>
      <ul>
        {friendBirthdays.map(({ userId, birthdate }) => (
          <li key={userId}>
            <User user={UserStore.getUser(userId)}>
              <TimestampComponent format="D" unix={birthdate.getTime() / 1000} />
            </User>
          </li>
        ))}
      </ul>
    </div>
  );
}