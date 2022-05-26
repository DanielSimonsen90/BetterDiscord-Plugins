import { BaseProps } from "@lib/React";

type Input<T, Props> = React.FunctionComponent<{
    onChange?: (value: T) => void;
    value: T;
} & Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'>
    & BaseProps
    & Props
>;
export default Input;