import Finder from "@danho-lib/dium/api/finder";

export type TextModule = {
  render: (props: {
    'data-text-variant': TextVairants,
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties;
  }) => JSX.BD.Rendered;
};

export const TextModule: TextModule = Finder.findBySourceStrings('lineClamp', 'tabularNumbers', 'scaleFontToUserSetting');
export default TextModule;

export type TextVairants = `${'text' | 'heading'}-${'sm' | 'md' | 'lg'}/${'light' | 'normal' | 'semibold' | 'bold'}`;