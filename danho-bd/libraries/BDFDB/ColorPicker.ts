import { Arrayable } from "danholibraryjs";
import { Component } from "../React";

type ColorPicker = Component<{
    className?: string,
    color?: Arrayable<string>,
    alpha?: number,
    onColorChange?: (color: Arrayable<string>) => void,
}, {
    isGradient?: boolean,
    gradientBarEnabled?: boolean,
    draggingAlphaCursor?: boolean,
    draggingGradientCursor?: boolean,
    selectedGradientCurve?: number,
}>
export default ColorPicker;