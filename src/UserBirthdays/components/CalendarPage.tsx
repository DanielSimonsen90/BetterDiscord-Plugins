import React, {
  classNames, useState, useRef,
  UserListItem, Calendar,
  useClickOutside,
  useKeybind,
} from "@react";
import { Text } from '@dium/components';

import { UserNoteActions } from "@actions";
import { QuickSwitcherStore } from "@stores";

import { buildTextItem } from "@danho-lib/ContextMenus";
import { ClassNamesUtils, ContextMenuUtils, StringUtils, UserUtils } from "@danho-lib/Utils";

import { MarkedUserModal, ModifyDateModal, ModifyUserModal } from "./modals";
import BirthdayStore from "../stores/BirthdayStore";
import { Settings } from "../settings";
import { BIRTHDAY_REGEX, CALENDAR_PAGE_CLASSNAME } from "../utils/constants";

type Props = {
  onClose(): void;
};

const ClassNamesModule = ClassNamesUtils.combineModuleByKeys<(
  'container'
)>(
  ['container', 'tabBody']
);

export default function CalendarPage({ onClose }: Props) {
  const [currentDate, setCurrentDate] = BirthdayStore.usePageStateSelector('currentDate');
  const [modifyDate, setModifyDate] = BirthdayStore.usePageStateSelector('modifyDate');
  const [modifyUser, setModifyUser] = BirthdayStore.usePageStateSelector('modifyUser');
  const [markedUser, setMarkedUser] = BirthdayStore.usePageStateSelector('markedUser');
  const [quickSwitcherOpen, setQuickSwitcherOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const birthdays = BirthdayStore.getSortedBirthdays();
  const shouldRenderModals = !!(modifyDate || modifyUser || markedUser);

  useClickOutside(ref, onClose);
  useKeybind(ref, ['Escape'], () => quickSwitcherOpen ? setQuickSwitcherOpen(false) : undefined);
  useKeybind(ref, ['Enter'], () => quickSwitcherOpen ? onClose() : undefined);

  QuickSwitcherStore.addReactChangeListener(() => {
    const isOpen = QuickSwitcherStore.isOpen();
    if (isOpen !== quickSwitcherOpen) setQuickSwitcherOpen(isOpen);
  });

  return (
    <div ref={ref} className={classNames(CALENDAR_PAGE_CLASSNAME, ClassNamesModule.container)}>
      <Calendar startDate={currentDate} onDateChange={setCurrentDate}
        onDateClick={setModifyDate}>
        {string => {
          const noYear = string.split('-').slice(1).join('-');
          const children = birthdays
            .filter(b => b.string === noYear)
            .map(({ user, turningAge }) => !user ? null : (
              <UserListItem key={user.id} user={user}
                onContextMenu={ContextMenuUtils.openContextMenu([
                  buildTextItem(
                    'birthday-user-open-modal',
                    `Open ${UserUtils.getUsernames(user).shift()}'s profile`,
                    () => UserUtils.openModal(user.id),
                  ),
                  buildTextItem(
                    'birthday-user-edit',
                    `Edit ${UserUtils.getUsernames(user).shift()}'s birthday`,
                    () => setModifyUser(user),
                  ),
                  buildTextItem(
                    'birthday-user-remove',
                    `Remove ${UserUtils.getUsernames(user).shift()}'s birthday`,
                    () => setMarkedUser(user),
                    { danger: true }
                  )
                ])}
              >
                {turningAge && (
                  <Text variant="text-md/normal" className="turning-age">
                    Turning {turningAge}
                  </Text>
                )}
              </UserListItem>
            ));

          return (
            <div className="birthday-users-container">
              {children}
            </div>
          );
        }}
      </Calendar>

      {shouldRenderModals && (
        <div className="modals">
          {modifyDate && (
            <ModifyDateModal open={!!modifyDate} onClose={() => setModifyDate(null)}
              date={modifyDate}
              onSubmit={async data => {
                const { userId } = data;
                if (!userId) return;

                const date = new Date(modifyDate!);
                BirthdayStore.setBirthday(userId, date);

                if (Settings.current.updateNotesOnCalendarChange) {
                  const noteResult = await UserNoteActions.getOrRequestNote(userId);
                  if (noteResult) {
                    const match = noteResult.match(BIRTHDAY_REGEX);
                    const storedString = match ? match[0] : '';
                    const update = storedString
                      ? noteResult.replace(storedString, '')
                      : (noteResult + ` ${StringUtils.formatDate(date, BirthdayStore.dateFormat)}`);

                    UserNoteActions.updateNote(userId, update);
                  }
                }

                setModifyDate(null);
              }}
            />
          )}
          {modifyUser && (
            <ModifyUserModal open={!!modifyUser} onClose={() => setModifyUser(null)}
              user={modifyUser} date={BirthdayStore.getUserBirthdate(modifyUser?.id) ?? new Date()}
              onSubmit={async data => {
                const { birthdate } = data;
                BirthdayStore.setBirthday(modifyUser.id, birthdate);

                if (Settings.current.updateNotesOnCalendarChange) {
                  const noteResult = await UserNoteActions.getOrRequestNote(modifyUser.id);
                  if (noteResult) {
                    const match = noteResult.match(BIRTHDAY_REGEX);
                    const storedString = match ? match[0] : '';

                    UserNoteActions.updateNote(
                      modifyUser.id,
                      noteResult.replace(storedString, StringUtils.formatDate(birthdate, BirthdayStore.dateFormat))
                    );
                  }
                }

                setModifyUser(null);
              }}
            />
          )}
          {markedUser && (
            <MarkedUserModal open={!!markedUser} onClose={() => setMarkedUser(null)}
              user={markedUser}
              onSubmit={async () => {
                const stored = BirthdayStore.getUserBirthdate(markedUser.id);
                BirthdayStore.removeUserBirthday(markedUser.id);

                if (Settings.current.updateNotesOnCalendarChange) {
                  const noteResult = await UserNoteActions.getOrRequestNote(markedUser.id);
                  if (noteResult) UserNoteActions.updateNote(
                    markedUser.id,
                    noteResult.replace(StringUtils.formatDate(stored, BirthdayStore.dateFormat), '')
                  );
                }

                setMarkedUser(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}