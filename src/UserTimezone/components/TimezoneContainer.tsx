import { React } from "@react";

import Timezone from './Timezone';
import { Settings } from "../settings/Settings";

type Props = {
  timezoneHour: number;
};

export function TimezoneContainer({ timezoneHour }: Props) {
  const settings = Settings.useSelector(state => ({
    hideIcon: state.hideTimezoneIcon,
    hideTimestamp: state.hideTimezoneTimestamp
  }));

  return <Timezone timezoneHour={timezoneHour} {...settings} />;
}