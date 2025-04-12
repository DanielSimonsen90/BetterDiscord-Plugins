import { React, useEffect, useMemo } from "@react";
import { Timestamp, Tooltip } from "@discord/components";
import { DiscordTimeFormat } from "@discord/types";
import { getBirthdate } from "../utils/constants";

type Props = {
  birthdate: string;
  /** @default false */
  hideTimestamp?: boolean;
  /** @default false */
  hideIcon?: boolean;
  /** @default T */
  timestampStyle?: DiscordTimeFormat;
};

export function Birthday(props: Props) {
  const { birthdate } = props;
  const { hideTimestamp = false, hideIcon = false, timestampStyle = 'T' } = props;

  const birthdateDate = useMemo(() => getBirthdate(birthdate), [birthdate]);

  const BirthdateContent = () => (
    <span className="birthdate">
      <Timestamp format={timestampStyle} unix={birthdateDate.getTime() / 1000} />
      <span className="space">,</span>
      <Timestamp format="R" unix={birthdateDate.getTime() / 1000} />
    </span>
  )
  const BirthdateComponent = (props: any = {}) => (
    <div className="birthday" {...props}>
      {!hideIcon && <span className="birthday-icon">🎂</span>}
      {!hideTimestamp && <BirthdateContent />}
    </div>
  );

  return (
    hideTimestamp
      ? <Tooltip text={<BirthdateContent />} children={BirthdateComponent} />
      : <BirthdateComponent />
  );
}

export default Birthday;