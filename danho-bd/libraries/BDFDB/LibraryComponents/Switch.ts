import Component from "danho-discordium/components/Component";

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