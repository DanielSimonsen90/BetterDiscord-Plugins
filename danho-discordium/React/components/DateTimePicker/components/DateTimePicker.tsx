import { DiscordTimeFormat } from '@discord';
import { moment } from '@discordium/modules';
import { classNames, React, useState, useMemo, useEffect, createRef } from 'danho-discordium/React';

import { BetterOmit } from 'danholibraryjs';
import { BaseProps } from 'danholibraryrjs';

import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

const { PopoutContainer, SvgIcon } = window.BDD.Components.BDFDB;

type Props = BetterOmit<BaseProps<HTMLFormElement>, 'onSubmit'> & {
    onSubmit(time: moment.Moment, format: DiscordTimeFormat): void,
}

export function DateTimePicker({ className, onSubmit, ...props }: Props) {
    const [year, setYear] = useState(moment().year());
    const [month, setMonth] = useState(moment().month());
    const [day, setDay] = useState(moment().date());
    const [hours, setHours] = useState(moment().hour());
    const [minutes, setMinutes] = useState(moment().minute());
    const date = useMemo(() => moment()
        .year(year).month(month).date(day)
        .hour(hours).minute(minutes)
        , [year, month, day, hours, minutes]);

    const ref = createRef<HTMLFormElement>();

    // console.clear();
    // console.log('DateTimePicker rendered', { isOpen, year, month, day, hours, minutes, date });

    return (
        <PopoutContainer
            align={PopoutContainer.Align.CENTER}
            animation={PopoutContainer.Animation.SCALE}
            position={PopoutContainer.Positions.TOP}
            renderPopout={({ toggle }) => (
                <form className={classNames('date-time-picker', className)} {...props} ref={ref}>
                    <DatePicker onDateSelect={value => {
                        setYear(value.year());
                        setMonth(value.month());
                        setDay(value.date());
                    }} />
                    <TimePicker initialValue={date} onTimeSelect={(value, format) => {
                        setHours(value.hour());
                        setMinutes(value.minute());

                        onSubmit(date, format);
                        toggle();
                    }} />
                </form>
            )}
        >
            <SvgIcon name={SvgIcon.Names.CALENDAR} />
        </PopoutContainer>
    )
}
export default DateTimePicker;

export { Props as DateTimePickerProps };