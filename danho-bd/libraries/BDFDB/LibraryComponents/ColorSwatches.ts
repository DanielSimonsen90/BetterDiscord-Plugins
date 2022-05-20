import { Component } from "@lib/React"

type ColorSwatches = Component<{
    className?: string,
    color?: string,
    colors?: Array<number>,
    colorRows?: number,
    customColor?: string,
    defaultCustomColor?: string,
    customSelected?: boolean,
    pickerConfig?: {
        gradient?: boolean,
        alpha?: boolean,
    },
    disabled?: boolean,
    pickerOpen?: boolean,
    onColorChange?: (color: string) => void,
    onPickerOpen?: () => void,
    onPickerClose?: () => void,
}>
export default ColorSwatches;