import { React, classNames, useState } from "@react";
import CalendarIcon from '@discord/components/Icons/CalendarIcon';
import { Clickable, Text } from '@dium/components';
import { DanhoBirthdayCalendarKey } from "../constants";
import useBirthdayNavProps from "../hooks/useBirthdayNavProps";
import { $ } from "@danho-lib/DOM";
import { Logger } from "@dium";
import CalendarPage from "./CalendarPage";

export default function BirthdayCalendarNavItem() {
  const [selected, setSelected] = useState(false);
  const props = useBirthdayNavProps({
    onClick: () => {
      setSelected(true);
      renderCalendarPage();
    },
    onSiblingClick: () => setSelected(false)
  });
  
  return (
    <li {...props?.listItemProps ?? {}} className={classNames(selected ? props?.selectedClassName : props?.listItemProps.className, 'danho-birthday-calendar')} key={DanhoBirthdayCalendarKey}>
      <Clickable {...props?.clickableProps}>
        <CalendarIcon />
        <Text>Birthdays</Text>
      </Clickable>
    </li>
  );
}

function renderCalendarPage() {
  const sidebar = $(s => s.className('base').className('content').className('sidebar'));
  const base = sidebar.parent;
  const children = base.children(undefined);
  children.shift();
  children.forEach(child => child.unmount());
  base.appendComponent(<CalendarPage />)
}