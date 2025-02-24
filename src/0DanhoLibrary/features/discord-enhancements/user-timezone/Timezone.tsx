import { React, useMemo, useState, useEffect, useCallback } from "@react";
import { Timestamp, Tooltip } from "@discord/components";

type Props = {
  timezoneHour: number;
  /** @default false */
  hideTimestamp?: boolean;
  /** @default false */
  hideIcon?: boolean;
};

export default function Timezone(props: Props) {
  const { timezoneHour } = props;
  const { hideTimestamp = false, hideIcon = false } = props;

  const getTimezoneDate = useCallback(() => {
    const date = new Date();
    date.setHours(date.getHours() + timezoneHour);
    return date;
  }, [timezoneHour]);

  const [timezoneDate, setTimezoneDate] = useState(getTimezoneDate);
;
  const timezoneIcon = useMemo(() => {
    if (hideIcon) return null;
    const clocks = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];
    return clocks[(timezoneDate.getHours() % 12) || 12];
  }, [hideIcon, timezoneHour]);

useEffect(() => {
  const interval = setInterval(() => setTimezoneDate(getTimezoneDate), 1000 * 60);
  return () => clearInterval(interval);
}, []);

const TimezoneComponent = (props: any = {}) => (
  <div className="timezone" {...props}>
    {!hideIcon && <span className="timezone-icon">{timezoneIcon}</span>}
    {!hideTimestamp && <Timestamp format='t' unix={timezoneDate.getTime() / 1000} />}
  </div>
);

return (
  hideTimestamp
    ? <Tooltip text={<Timestamp format='t' unix={timezoneDate.getTime() / 1000} />} children={TimezoneComponent} />
    : <TimezoneComponent />
);
}