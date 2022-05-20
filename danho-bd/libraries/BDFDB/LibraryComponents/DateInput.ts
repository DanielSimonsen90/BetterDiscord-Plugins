import { Component } from "@lib/React";

type DateInput = Component<{
    className?: string,
    label?: string,
    dateString?: string,
    timeString?: string,
    onChange?: (props: any) => void,
}>
export default DateInput;