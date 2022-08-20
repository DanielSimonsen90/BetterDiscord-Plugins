import { Finder } from "@discordium/api";

export type TimeInput = React.FunctionComponent<{
    value: moment.Moment;
    onChange(date: moment.Moment): void;
    hideValue?: boolean;
    disabled?: boolean;
}>
export const TimeInput: TimeInput = Finder.byName("TimeInput");
/**
 * @warning Component is only found if user has interacted with a component that uses it.
 */
export default TimeInput;