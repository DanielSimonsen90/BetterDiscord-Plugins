import { classNames, React, useMemo } from 'danho-discordium/React';
import { BaseProps } from 'danholibraryrjs';
import { ClassModules, ButtonContainer, SecondaryButton, BDFDB } from 'danho-discordium/React/components';

type Props = BaseProps & {
    date: moment.Moment;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
}

export default function CalendarHeader({ date, onPreviousMonth, onNextMonth, className, ...props }: Props) {
    const month = useMemo(() => date.format('MMMM'), [date]);
    const year = useMemo(() => date.format('YYYY'), [date]);

    const onGoLeft = () => onPreviousMonth();
    const onGoRight = () => onNextMonth();

    // console.log('CalendarHeader rendered', { date, month, year });

    return (
        <ButtonContainer className={classNames('calendar-header', className)} {...props}>
            <SecondaryButton onClick={onGoLeft}>
                <BDFDB.SvgIcon name={BDFDB.SvgIcon.Names.LEFT_CARET} />
            </SecondaryButton>
            <div className={classNames('calendar-header-title', ClassModules.Titles.h1, ClassModules.Titles.defaultColor)}>
                <span>{month}</span>
                <span>{year}</span>
            </div>
            <SecondaryButton onClick={onGoRight}>
                <BDFDB.SvgIcon name={BDFDB.SvgIcon.Names.RIGHT_CARET} />
            </SecondaryButton>
        </ButtonContainer>
    );
}

export { Props as HeaderProps };