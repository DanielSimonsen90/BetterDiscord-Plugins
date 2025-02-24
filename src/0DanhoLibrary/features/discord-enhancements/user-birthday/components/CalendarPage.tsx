import { React } from "@react";
import { Text } from '@dium/components';
import { RelationshipStore, UserNoteStore, UserStore } from "@stores";
import { BIRTHDAY_REGEX, getBirthdate } from "../constants";
import TimestampComponent from "@discord/components/Timestamp";


export default function CalendarPage() {
  const friends = RelationshipStore.getFriendIDs();
  const friendBirthdays = friends
    .map(userId => Object.assign({}, UserNoteStore.getNote(userId), { userId }))
    .filter(noteState => !noteState.loading && BIRTHDAY_REGEX.test(noteState.note))
    .map(noteStateData => ({
      birthdate: getBirthdate(noteStateData.note.match(BIRTHDAY_REGEX)[0]),
      userId: noteStateData.userId
    }));
  
  return (
    <div className="calendar-page">
      <Text variant="heading-md/medium" style={{ color: 'var(--text-primary);' }}>Hello, World!</Text>
      <br />
      <ul>
        {friendBirthdays.map(({ userId, birthdate }) => (
          <li key={userId}>
            <img src={UserStore.getUser(userId)?.getAvatarURL()} alt={UserStore.getUser(userId)?.username ?? userId} />
            <TimestampComponent format="D" unix={birthdate.getTime() / 1000} />
          </li>
        ))}
      </ul>
    </div>
  );
}