import { React, classNames } from "@react";
import CalendarIcon from '@discord/components/Icons/CalendarIcon';
import { AvatarWithText, AvatarWithTextClassNameModule } from "@discord/components";
import { Clickable } from '@dium/components';

import useBirthdayNavProps from "../hooks/useBirthdayNavProps";
import { DanhoBirthdayCalendarKey } from "../utils/constants";
import usePageEffects from "../hooks/usePageEffects";
import BirthdayStore from "../stores/BirthdayStore";

export function BirthdayCalendarNavItem() {
  const [selected, setSelected] = BirthdayStore.usePageStateSelector('show');
  const props = useBirthdayNavProps({
    onClick: () => setSelected(true),
    onSiblingClick: () => setSelected(false)
  });
  const className = classNames(
    'danho-birthday-calendar',
    selected ? props?.selectedClassName : props?.listItemProps.className.replace(props?.selectedClassName ?? '', ''), 
  );
  
  usePageEffects(selected, setSelected);

  return (
    <li key={DanhoBirthdayCalendarKey} {...props?.listItemProps ?? {}} className={className}>
      <Clickable {...props?.clickableProps}>
        <a className={AvatarWithTextClassNameModule.link} href="#" onClick={e => e.preventDefault()}>
          <AvatarWithText innerClassName={AvatarWithTextClassNameModule.avatarWithText}
            avatar={<CalendarIcon />}
            name='Birthdays'
          />
        </a>
      </Clickable>
    </li>
  );
}