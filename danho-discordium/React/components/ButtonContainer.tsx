import { React, classNames } from '@discordium/modules';
import { Arrayable } from 'danholibraryjs';
import { ClassModules } from 'danho-discordium/React/components/Discord/MiniModules';

type ButtonContainerProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    children: React.ReactNode;
    className?: string;
    flex?: boolean;
    direction?: 'row' | 'column' | 'vertical' | 'horizontal';
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    wrap?: boolean | 'reverse';
    gap?: number | string;

    rowGap?: number | string;
    columnGap?: number | string;
    layout?: Arrayable<string>;

    // onButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const pascalCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export function ButtonContainer({
    children, style, className,
    flex = true, direction, align, justify, wrap, gap,
    rowGap, columnGap, layout,
    ...props
}: ButtonContainerProps) {
    const _style: React.CSSProperties = {
        gap, rowGap, columnGap,
        gridTemplateAreas: layout && (Array.isArray(layout) ? `"${layout.join('" "')}"` : `"${layout}"`),
        ...(style || {})
    }

    return (
        <div {...props} className={classNames(
            className,
            'button-container',
            flex ? ClassModules.Flex.flex : ClassModules.Embed.grid,
            direction && (direction === 'column' || direction === 'vertical') ? 'vertical' : 'horizontal',
            align && ClassModules.Flex[`align${pascalCase(align)}`],
            justify && ClassModules.Flex[`justify${pascalCase(justify)}`],
            wrap && ClassModules.Flex[wrap === true ? 'wrap' : 'wrapReverse'],
        )} style={Object.keys(_style).length && _style}>
            {children}
        </div>
    );
}
export default ButtonContainer;