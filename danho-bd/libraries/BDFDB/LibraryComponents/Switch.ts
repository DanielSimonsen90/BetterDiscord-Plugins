import { ComponentClass } from "@react";

type Switch = ComponentClass<{
    value: boolean,
    onChange: (value: boolean) => void,
    disabled?: boolean,
    uncheckedColor?: string,
    checkedColor?: string,
    className?: string,
    size?: string,
}>
export default Switch;