import React from '../../React';
import { classNames } from '../../utils';
import { Text } from '@dium/components';
import { ScrollerAuto, ScrollerLooks } from '@discord/components';
import { StringUtils } from '@utils';

type MonthDaysProps = {
  currentDate: Date;
  children: (string: string, date: Date) => JSX.Element;
  onDateClick?: (string: string, date: Date) => void;
};

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getShiftedDay = (day: number) => (day === 0 ? 6 : day - 1); // Shift Sunday (0) to the end of the week

export default function MonthDays({ currentDate, children, onDateClick }: MonthDaysProps) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getShiftedDay(new Date(year, month, 1).getDay()); // Adjust the first day

  const days = new Array<JSX.Element>();
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className='danho-calendar__day--empty'></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = StringUtils.formatDate(date, 'YYYY-MM-DD');

    const isToday = new Date().toDateString() === date.toDateString();
    const child = children(dateString, date);

    days.push(
      <div key={day}
        className={classNames('danho-calendar__day', isToday && 'danho-calendar__day--today')}
        onClick={() => onDateClick?.(dateString, date)}
      >
        <Text variant='heading-md/bold' className='danho-calendar__day-number'>
          {day}
        </Text>
        <ScrollerAuto className={classNames(ScrollerLooks.thin, 'danho-calendar__day-content')}>
          {child}
        </ScrollerAuto>
      </div>
    );
  }

  return <>{days}</>;
}