import { moment } from '@discordium/modules';
import { React, useCallback, useState, useMemo } from 'danho-discordium/React';

import { BetterOmit, TransformType } from 'danholibraryjs';
import { BaseProps } from 'danholibraryrjs';

import CalendarGrid, { CalendarGridProps } from './CalendarGrid';
import CalendarHeader, { HeaderProps } from './CalendarHeader';

type Require<T, Keys extends keyof T> = Omit<T, Keys> & Required<Pick<T, Keys>>;
type PartialNoBaseProps<T> = Partial<Omit<T, keyof BaseProps>>;
type PublicHeaderProps = PartialNoBaseProps<BetterOmit<TransformType<HeaderProps, () => void, () => boolean>, 'date'>>;
type PublicGridProps = PartialNoBaseProps<BetterOmit<CalendarGridProps, 'selectedDate'>>
type Props = BaseProps & PublicHeaderProps & Require<PublicGridProps, 'onDateSelect'> & {
    headerProps?: Omit<HeaderProps, keyof PublicHeaderProps>,
    gridProps?: Omit<CalendarGridProps, keyof PublicGridProps>,
}

export function DatePicker({ onDateSelect, headerProps, gridProps, ...props }: Props) {
    const [year, setYear] = useState(moment().year());
    const [month, setMonth] = useState(moment().month());
    const [day, setDay] = useState(moment().date());

    const date = useMemo(() => moment()
        .year(year).month(month).date(day)
        , [year, month, day]);
    const _headerProps = useMemo<PublicHeaderProps>(() => ({
        onNextMonth: props.onNextMonth,
        onPreviousMonth: props.onPreviousMonth,
    }), [props.onNextMonth, props.onPreviousMonth]);
    const _gridProps = useMemo<PublicGridProps>(() => ({
        allowFuture: props.allowFuture,
        allowPast: props.allowPast,
        blankWeeks: props.blankWeeks,
        rows: props.rows,
    }), [props.allowFuture, props.allowPast, props.blankWeeks, props.rows]);
    const _props = useMemo(() => window.BDFDB.ObjectUtils.exclude<BetterOmit<Props, 'onDateSelect'>, keyof BetterOmit<Props, 'onDateSelect'>>(props,
        ...Object.keys(_headerProps) as Array<keyof PublicHeaderProps>,
        ...Object.keys(_gridProps) as Array<keyof BetterOmit<PublicGridProps, 'onDateSelect'>>,
    ), [props, _headerProps, _gridProps]);

    const onPreviousMonth = useCallback(() => {
        if (!_headerProps.onPreviousMonth || _headerProps.onPreviousMonth()) {
            if (month === 0) {
                setYear(y => y - 1);
                setMonth(11);
            } else {
                setMonth(m => m - 1);
            }
        }
    }, [_headerProps, _headerProps.onPreviousMonth]);
    const onNextMonth = useCallback(() => {
        if (!_headerProps.onNextMonth || _headerProps.onNextMonth()) {
            if (month === 11) {
                setYear(y => y + 1);
                setMonth(0);
            } else {
                setMonth(m => m + 1);
            }
        }
    }, [_headerProps, _headerProps.onNextMonth]);

    // console.log('DatePicker', { year, month, day, date, _headerProps, _gridProps, _props });

    return (
        <div id="calendar-picker" {..._props}>
            <CalendarHeader date={date} onPreviousMonth={onPreviousMonth} onNextMonth={onNextMonth} {...headerProps} />
            <CalendarGrid selectedDate={date} onDateSelect={d => {
                setYear(d.year());
                setMonth(d.month());
                setDay(d.date());

                onDateSelect(d);
            }} {..._gridProps} {...gridProps} />
        </div>
    );
}
export default DatePicker;
export { Props as DatePickerProps };