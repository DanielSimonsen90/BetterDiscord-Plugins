import { ComponentClass } from "@react";

type DateInput = ComponentClass<{
    className?: string,
    label?: string,
    dateString?: string,
    timeString?: string,
    onChange?: (props: any) => void,
}>
export default DateInput;