import { ComponentClass, Children } from "@react";

type TextInput = ComponentClass<{
    value: string,
    onChange?: (value: string, component: TextInput) => void,
    valuePrefix?: string,
    onInput?: (value: string, component: TextInput) => void,
    onKeyDown?: (e: KeyboardEvent, component: TextInput) => void,
    onBlur?: (e: KeyboardEvent, component: TextInput) => void,
    onFocus?: (e: KeyboardEvent, component: TextInput) => void,
    onMouseEnter?: (e: KeyboardEvent, component: TextInput) => void,
    onMouseLeave?: (e: KeyboardEvent, component: TextInput) => void,
    pressedTimeout?: number,
    type?: HTMLInputElement["type"],
    size?: string,
    maxLength?: number,
    style?: {[key: string]: string},
    inputRef?: HTMLInputElement,
    inputChildren?: Children,
    mode: "comp" | string,
    colorPickerOpen?: boolean,
    controlsRef?: HTMLDivElement,
    noAlpha?: boolean
}>
export default TextInput;