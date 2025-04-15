import React, { useState } from '../../React';
import MonthDays from './MonthDays';
import { Button, ScrollerAuto, ScrollerLooks, Text } from '@discord/components';

type CalendarProps = {
  children: (string: string, date: Date) => JSX.Element;
  onDateClick?: (string: string, date: Date) => void;

  startDate?: Date;
  onDateChange?: (date: Date) => void;
};

export function Calendar({ children, onDateClick, ...props }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(props.startDate || new Date());
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prevMonth);
    if (props.onDateChange) props.onDateChange(prevMonth);
  };
  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextMonth);
    if (props.onDateChange) props.onDateChange(nextMonth);
  };

  return (
    <div className='danho-calendar'>
      <ScrollerAuto className={ScrollerLooks.thin}>
        <div className='danho-calendar__header'>
          <Button look={Button.Looks.FILLED} onClick={handlePrevMonth}>Previous</Button>
          <Text variant='heading-xl/bold'>
            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
          </Text>
          <Button look={Button.Looks.FILLED} onClick={handleNextMonth}>Next</Button>
        </div>
        <div className="danho-calendar__content">
          <div className='danho-calendar__day-names'>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <Text key={day} variant='heading-lg/bold' className='danho-calendar__day-name'>
                {day}
              </Text>
            ))}
          </div>
          <div className='danho-calendar__month-days'>
            <MonthDays {...{ currentDate, children, onDateClick }} />
          </div>
        </div>
      </ScrollerAuto>
    </div>
  );
};

export default Calendar;