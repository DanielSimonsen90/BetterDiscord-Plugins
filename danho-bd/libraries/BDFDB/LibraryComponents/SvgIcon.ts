export default interface SvgIcon extends React.ComponentClass<React.DetailedHTMLProps<React.HTMLAttributes<SVGElement>, SVGElement> & {
    name: SvgIcon['Names'] | string;
    width?: number;
    height?: number;
}> {
    Names: {
        [key: string]: {
            icon: string;
            defaultProps?: {
                width: number;
                height: number;
            }
        } & {
            [key: string]: any
        }
    }
}