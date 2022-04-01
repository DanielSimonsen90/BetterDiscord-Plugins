import { Component } from "../../React";

type Switch = Component<{
    value: boolean,
    onChange: (value: boolean) => void,
    disabled?: boolean,
    uncheckedColor?: string,
    checkedColor?: string,
    className?: string,
    size?: string,
}>
export default Switch;