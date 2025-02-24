import { React } from "@react";
import Timezone from './Timezone';
import { Settings } from "src/0DanhoLibrary/Settings";

type Props = {
  timezoneHour: number;
};

export default function TimezoneContainer({ timezoneHour }: Props) {
  const settings = Settings.useSelector(state => ({
    hideIcon: state.hideTimezoneIcon,
    hideTimestamp: state.hideTimezoneTimestamp
  }));

  return <Timezone timezoneHour={timezoneHour} {...settings} />;
}