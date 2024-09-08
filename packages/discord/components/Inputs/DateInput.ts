import { Finder } from "@dium/api";

export type DateInput = React.FunctionComponent<{
    value: moment.Moment;
    onSelect(date: moment.Moment): void;
    /**@default MMM D, YYYY */
    dateFormat?: string;
    minDate?: moment.Moment;
    maxDate?: moment.Moment;
    disabled?: boolean;
}>
export const DateInput: DateInput = Finder.byName("DateInput");

/**
 * @warning Component is only found if user has interacted with a component that uses it.
 */
export default DateInput;