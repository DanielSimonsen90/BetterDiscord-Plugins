type ColorTypes = "RGB" | "RGBA" | "RGBCOMP" | "HSL" | "HSLA" | "HSLCOMP" | "HEX" | "HEXA" | "INT"

type ColorUtils = {
    convert(color: string, conv: ColorTypes, type: ColorTypes): string,
    setAlpha(color: string, a: number, conv: ColorTypes): string,
    getAlpha(color: string): number,
    change(color: string, value: number, conv: ColorTypes): string,
    invert(color: string, conv: ColorTypes): string,
    compare(color1: string, color2: string): boolean,
    isBright(color: string, compare: number): boolean,
    getType(color: string): ColorTypes,
    createGradient(colorObj: Array<string>, direction: string): string,
}
export default ColorUtils;