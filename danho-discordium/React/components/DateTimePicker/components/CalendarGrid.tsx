import { moment } from '@discordium/modules';
import { BaseProps } from 'danholibraryrjs';

import CalendarDate from './CalendarDate';
import useCalendarDates from '../hooks/useCalendarDates';

import { React, classNames } from '@discordium/modules';
const { useMemo } = React;

type Props = BaseProps<HTMLTableElement> & {
    selectedDate: moment.Moment;
    onDateSelect(date: moment.Moment): void;

    allowFuture?: boolean;
    allowPast?: boolean;
    blankWeeks?: number;
    rows?: number;
}

export default function CalendarGrid({ blankWeeks, rows, selectedDate, allowFuture, allowPast, className, onDateSelect, ...props }: Props) {
    const days = useCalendarDates({ selectedDate, blankWeeks, rows, allowFuture, allowPast });
    const weekDays = useMemo(() => {
        let days = moment.weekdaysShort(true);
        days.push(days.shift());
        return days;
    }, []);

    // console.log('CalendarGrid rendered', { days, weekDays, selectedDate, allowFuture, allowPast, blankWeeks, rows });

    return (
        <table className={classNames('calendar-grid', className)} {...props}>
            <thead>
                <tr>
                    {weekDays.map((day, index) => (
                        <th key={index}>{day}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {[...days.entries()].map(([week, days]) => (
                    <tr key={week}>
                        {days.map((day, index) => (
                            <CalendarDate key={index} date={day} {...day} onClick={onDateSelect} />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export { Props as CalendarGridProps };