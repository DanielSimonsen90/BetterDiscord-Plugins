import { useMemo } from "@react";

const DEFAULT_ROW_COUNT = 5;

type Day = {
    date: moment.Moment,
    isSelectable: boolean,
    isSelected: boolean,
}

type Props = {
    selectedDate: moment.Moment;
    blankWeeks?: number;
    rows?: number;

    allowPast?: boolean;
    allowFuture?: boolean;
}

/**
 * 
 * @param props 
 * @returns Map<weekNumber, Day[]>
 */
export default function useCalendarDates({ 
    selectedDate, 
    blankWeeks = 0, rows = DEFAULT_ROW_COUNT, 
    allowPast = true, allowFuture = true 
}: Props) {
    const start = useMemo(() => selectedDate.clone().startOf('month'), [selectedDate]); // 1/8/2022
    const end = useMemo(() => selectedDate.clone().endOf('month'), [selectedDate]); // 31/8/2022

    const calendarStart = useMemo(() => start.clone().subtract(blankWeeks, 'weeks').weekday(1), [start, blankWeeks]); 
    const calendarRows = useMemo(() => rows - blankWeeks, [rows, blankWeeks]);
    const calendarEnd = useMemo(() => calendarStart.clone().add(calendarRows, 'weeks').weekday(7), [calendarStart, calendarRows]);
    
    const weeks = useMemo(() => {        
        const weeks = new Map<number, Day[]>();
        for (let week = 1; week <= calendarRows; week++) {
            weeks.set(week, []);

            for (let day = 1; day <= 7; day++) {
                const date = calendarStart.clone().add(week - 1, 'weeks').weekday(day);
                weeks.set(week, [...weeks.get(week), { date, 
                    isSelectable: (date.isBefore(start) && allowPast) 
                        || (date.isAfter(end) && allowFuture) 
                        || date.isBetween(start, end) 
                        || date.unix() === start.unix(),
                    isSelected: date.isSame(selectedDate, 'day')
                }]);
            }
        }

        return weeks;
    }, [selectedDate]);

    // console.log('useCalendarDates result', { weeks, calendarStart, calendarEnd, start, end, selectedDate, rows, blankWeeks, allowPast, allowFuture });
    
    return weeks;
}