import Finder from "../../finder";

export type TextModule = JSX.BD.FRC<{
  'data-text-variant': TextVairants,
  children: React.ReactNode,
  className?: string,
  style?: React.CSSProperties;
}, any>;

export const TextModule = Finder.bySourceStrings<TextModule>('lineClamp', 'tabularNumbers', 'scaleFontToUserSetting');
export default TextModule;

export type TextVairants = `${'text' | 'heading'}-${'sm' | 'md' | 'lg'}/${'light' | 'normal' | 'semibold' | 'bold'}`;