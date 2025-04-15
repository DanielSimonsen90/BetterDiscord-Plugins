import { React, useMemo } from "@react";
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

  const unix = useMemo(() => getBirthdate(birthdate).getTime() / 1000, [birthdate]);

  const BirthdateContent = () => (
    <span className="birthdate">
      <Timestamp format={timestampStyle} unix={unix} />
      <span className="space">,</span>
      <Timestamp format="R" unix={unix} />
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