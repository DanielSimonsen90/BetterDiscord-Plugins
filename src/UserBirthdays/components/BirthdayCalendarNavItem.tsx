import { React, classNames, useState } from "@react";
import CalendarIcon from '@discord/components/Icons/CalendarIcon';
import { Clickable, Text } from '@dium/components';

import useBirthdayNavProps from "../hooks/useBirthdayNavProps";
import { DanhoBirthdayCalendarKey } from "../utils/constants";
import usePageEffects from "../hooks/usePageEffects";

export function BirthdayCalendarNavItem() {
  const [selected, setSelected] = useState(false);
  const props = useBirthdayNavProps({
    onClick: () => setSelected(true),
    onSiblingClick: () => setSelected(false)
  });
  const className = classNames(
    'danho-birthday-calendar',
    selected ? props?.selectedClassName : props?.listItemProps.className.replace(props?.selectedClassName ?? '', ''), 
  );
  
  usePageEffects(selected);

  return (
    <li key={DanhoBirthdayCalendarKey} {...props?.listItemProps ?? {}} className={className}>
      <Clickable {...props?.clickableProps}>
        <CalendarIcon />
        <Text>Birthdays</Text>
      </Clickable>
    </li>
  );
}