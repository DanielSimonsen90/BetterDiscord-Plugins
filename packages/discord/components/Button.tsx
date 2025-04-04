import Finder from '@danho-lib/dium/api/finder';
import { React } from '@dium/modules';

enum ButtonLooks { BLANK, FILLED, INVERTED, LINK, OUTLINED }
enum ButtonSizes { ICON, LARGE, MAX, MEDIUM, MIN, NONE, SMALL, TINY, XLARGE }
enum Colors { BLACK, BRAND, BRAND_NEW, GREEN, LINK, PRIMARY, RED, TRANSPARENT, WHITE, YELLOW }

type ButtonProps = {
    look?: ButtonLooks;
    color?: Colors;
    borderColor?: Colors;
    hover?: any;
    size?: ButtonSizes;
    fullWidth?: boolean;
    grow?: boolean;
    disabled?: boolean;
    submitting?: boolean;
    type?: string;
    style?: React.CSSProperties;
    wrapperClassName?: string;
    className?: string;
    innerClassName?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onDoubleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
    rel?: string;
    buttonRef?: React.Ref<HTMLButtonElement>;
    focusProps?: any;
    "aria-label"?: string;
}

export interface ButtonComponent extends React.FunctionComponent<ButtonProps> {
    BorderColors: Record<keyof typeof Colors, Colors>
    Colors: Record<keyof typeof Colors, Colors>;
    Hovers: Record<keyof typeof ButtonLooks, ButtonLooks>;
    Link: React.FunctionComponent<{
        look?: ButtonLooks;
        color?: Colors;
        borderColor?: Colors;
        hover?: any;
        size?: ButtonSizes;
        fullWidth?: boolean;
        grow?: boolean;
        style?: React.CSSProperties;
        className?: string;
        innerClassName?: string;
        onClick?: (e: React.MouseEvent) => void;
        onMouseDown?: (e: React.MouseEvent) => void;
        onMouseUp?: (e: React.MouseEvent) => void;
        children?: React.ReactNode;
        rel?: string;
    }>;
    Looks: Record<keyof typeof ButtonLooks, ButtonLooks>;
    Sizes: Record<keyof typeof ButtonSizes, ButtonSizes>;
}

// export const Button: ButtonComponent = Finder.byKeys(["Button"]).Button;
export const Button: ButtonComponent = Finder.findBySourceStrings("FILLED", "BRAND", "MEDIUM", "button", "buttonRef");
export default Button;

export const SuccessButton = (props: ButtonProps) => <Button {...props} color={Button.Colors.GREEN} look={Button.Looks.FILLED} data-type="success" />;
export const SecondaryDanger = (props: ButtonProps) => <Button {...props} color={Button.Colors.RED} look={Button.Looks.OUTLINED} data-type="cancel" />;

export const PrimaryButton = (props: ButtonProps) => <Button {...props} color={Button.Colors.BRAND} look={Button.Looks.FILLED} data-type="primary" />;
export const SecondaryButton = (props: ButtonProps) => <Button {...props} color={Button.Colors.PRIMARY} look={Button.Looks.OUTLINED} data-type="secondary" />;
export const LinkButton = (props: ButtonProps) => <Button {...props} color={Button.Colors.LINK} look={Button.Looks.LINK} data-type="link" />;