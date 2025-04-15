import { React } from '@react';
import Birthday from './Birthday';
import { DiscordTimeFormat } from '@discord/types';
import { Settings } from '../settings/Settings';

type Props = {
  birthdate: string;
}

export function BirthdayContainer({ birthdate }: Props) {
  const settings = Settings.useSelector(state => ({
    hideIcon: state.hideBirthdateIcon,
    hideTimestamp: state.hideBirthdateTimestamp,
    timestampStyle: state.birthdateTimestampStyle as DiscordTimeFormat
  }));
  
  return <Birthday birthdate={birthdate} {...settings} />;
}