type DateInputProps = {
    className?: string,
    label: string,
    dateString?: string,
    timeString?: string,
    formatString?: string,
    timeOffset?: number,
    language?: string,

    noPreview?: boolean,
    prefix?: string,
    suffix?: string,
    
    onChange?: (props: Pick<DateInputProps, 'formatString' | 'dateString' | 'timeString' | 'timeOffset' | 'language'>) => void,
}
type DateInput = React.ComponentClass<DateInputProps>
export default DateInput;