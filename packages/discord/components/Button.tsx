import React, { CSSProperties, FunctionComponent, ReactNode, MouseEvent, KeyboardEvent, Ref } from '@react';
import { Finder } from '@injections';

enum ButtonLooks { BLANK, FILLED, LINK, OUTLINED }
enum ButtonSizes { ICON, LARGE, MAX, MEDIUM, MIN, NONE, SMALL, TINY }
enum Colors { BRAND, BRAND_INVERTED, CUSTOM, GREEN, LINK, PRIMARY, RED, TRANSPARENT, WHITE }

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
    style?: CSSProperties;
    wrapperClassName?: string;
    className?: string;
    innerClassName?: string;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    onDoubleClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    onMouseDown?: (e: MouseEvent<HTMLButtonElement>) => void;
    onMouseUp?: (e: MouseEvent<HTMLButtonElement>) => void;
    onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
    children?: ReactNode;
    rel?: string;
    buttonRef?: Ref<HTMLButtonElement>;
    focusProps?: any;
    "aria-label"?: string;
};

export interface ButtonComponent extends FunctionComponent<ButtonProps> {
    BorderColors: Record<keyof typeof Colors, Colors>;
    Colors: Record<keyof typeof Colors, Colors>;
    Hovers: Record<keyof typeof ButtonLooks, ButtonLooks>;
    Link: FunctionComponent<{
        look?: ButtonLooks;
        color?: Colors;
        borderColor?: Colors;
        hover?: any;
        size?: ButtonSizes;
        fullWidth?: boolean;
        grow?: boolean;
        style?: CSSProperties;
        className?: string;
        innerClassName?: string;
        onClick?: (e: MouseEvent) => void;
        onMouseDown?: (e: MouseEvent) => void;
        onMouseUp?: (e: MouseEvent) => void;
        children?: ReactNode;
        rel?: string;
    }>;
    Looks: Record<keyof typeof ButtonLooks, ButtonLooks>;
    Sizes: Record<keyof typeof ButtonSizes, ButtonSizes>;
}

// export const Button: ButtonComponent = Finder.byKeys(["Button"]).Button;
export const Button: ButtonComponent = Finder.bySourceStrings("FILLED", "BRAND", "MEDIUM", "button", "buttonRef");
export default Button;

export const SuccessButton = (props: ButtonProps) => <Button {...props} color={Button.Colors.GREEN} look={Button.Looks.FILLED} data-type="success" />;
export const SecondaryDanger = (props: ButtonProps) => <Button {...props} color={Button.Colors.RED} look={Button.Looks.OUTLINED} data-type="cancel" />;

export const PrimaryButton = (props: ButtonProps) => <Button {...props} color={Button.Colors.BRAND} look={Button.Looks.FILLED} data-type="primary" />;
export const SecondaryButton = (props: ButtonProps) => <Button {...props} color={Button.Colors.PRIMARY} look={Button.Looks.OUTLINED} data-type="secondary" />;
export const LinkButton = (props: ButtonProps) => <Button {...props} color={Button.Colors.LINK} look={Button.Looks.LINK} data-type="link" />;