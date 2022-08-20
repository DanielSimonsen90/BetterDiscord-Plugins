import { BetterOmit } from 'danholibraryjs';
import { BaseProps } from 'danholibraryrjs';

import { React, useState, useEffect, useMemo, useCallback, ClassModules } from 'danho-discordium/React';
import { moment } from '@discordium/modules';
import { ButtonContainer, PrimaryButton } from '@react/components';
import { DiscordTimeFormat } from '@discord';

const { parseBioReact } = window.BDD.Modules;

type Props = BetterOmit<BaseProps, 'onChange'> & {
    onTimeSelect(time: moment.Moment, format: DiscordTimeFormat): void,

    initialValue?: moment.Moment,
    onFormatSelect?: (format: DiscordTimeFormat) => void,
    onChange?: (time: moment.Moment) => void,
}

export function TimePicker({ onTimeSelect, initialValue, onChange, onFormatSelect, className }: Props) {
    const [format, setFormat] = useState<DiscordTimeFormat>('f');
    const [hours, setHours] = useState(initialValue?.hour().toString() ?? "0");
    const [minutes, setMinutes] = useState(initialValue?.minute().toString() ?? "0");

    const date = useMemo(() => {
        const date = initialValue ?? moment();
        date.hour(parseInt(hours) || 0);
        date.minute(parseInt(minutes) || 0);
        return date;
    }, [initialValue, hours, minutes])
    const formatTimestamp = useCallback((format: DiscordTimeFormat) => parseBioReact(`<t:${date.unix()}:${format}>`)[0].props.node.formatted, [date, initialValue]);

    useEffect(() => {
        onChange?.(date);
    }, [date]);

    // console.log('TimePicker rendered', { format, hours, minutes, date, formatTimestamp: formatTimestamp(format), initialValue })

    return (
        <div id="time-picker" className={className}>
            <div className="time-picker-inputs">
                <input className={ClassModules.BasicInputs.inputDefault} type="number" min={0} max={23} placeholder="Hours"
                    value={hours} onChange={e => setHours(e.target.value)}
                />
                <input className={ClassModules.BasicInputs.inputDefault} type="number" min={0} max={59} placeholder="Minutes"
                    value={minutes} onChange={e => setMinutes(e.target.value)}
                />
                <select className={ClassModules.BasicInputs.inputDefault} name="format" id="timestamp-format" onChange={e => {
                    const value = e.target.value as DiscordTimeFormat;
                    setFormat(value);
                    onFormatSelect?.(value);
                }}>
                    <option value="f">{formatTimestamp('f')}</option>
                    <option value="F">{formatTimestamp('F')}</option>
                    <option value="d">{formatTimestamp('d')}</option>
                    <option value="D">{formatTimestamp('D')}</option>
                    <option value="t">{formatTimestamp('t')}</option>
                    <option value="T">{formatTimestamp('T')}</option>
                    <option value="R">{formatTimestamp('R')}</option>
                </select>
            </div>
            <ButtonContainer flex={false}>
                <PrimaryButton type="submit" onClick={() => onTimeSelect(date, format)}>Select</PrimaryButton>
            </ButtonContainer>
        </div>
    );
}
export default TimePicker;
export { Props as TimePickerProps };