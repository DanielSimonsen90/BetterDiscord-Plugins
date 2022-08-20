import { React } from 'discordium';
import { BaseProps } from 'danholibraryrjs';

type Props = Omit<BaseProps<HTMLTableCellElement>, 'onClick'> & {
    date: moment.Moment,
    isSelected: boolean,
    isSelectable: boolean,
    onClick(date: moment.Moment): void;
}

export default function CalendarDate({ date, isSelected, isSelectable, onClick, ...props }: Props) {
    return (
        <td data-selected={isSelected ? true : undefined} data-selectable={isSelectable ? undefined : false}
            onClick={() => isSelectable && onClick(date)} {...props}>
            {date.date()}
        </td>
    );
}