import Finder from "@danho-lib/dium/api/finder";

export type TextModule = {
  render: (props: {
    className: string,
    children: string,
    'data-text-variant': `${'text' | 'heading'}-${'sm' | 'md' | 'lg'}/${'light' | 'normal' | 'semibold' | 'bold'}`,
    style: React.CSSProperties;
  }) => JSX.BD.Rendered;
};

export const TextModule: TextModule = Finder.findBySourceStrings('lineClamp', 'tabularNumbers', 'scaleFontToUserSetting');
export default TextModule;