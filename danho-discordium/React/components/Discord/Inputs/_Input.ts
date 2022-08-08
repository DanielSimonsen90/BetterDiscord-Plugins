import { CSSProperties } from "react";

type Input<T, Props> = React.FunctionComponent<{
    onChange?: (value: T) => void;
    value?: T;
    hideBorder?: boolean;
} & Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'>
    & Props
    & {
        style?: CSSProperties
    }
>;
export default Input;