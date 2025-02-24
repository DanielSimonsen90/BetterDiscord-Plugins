import { React } from '@react';
import { Settings } from 'src/0DanhoLibrary/Settings';
import Birthday from './Birthday';
import { DiscordTimeFormat } from '@discord/types';

type Props = {
  birthdate: string;
}

export default function BirthdayContainer({ birthdate }: Props) {
  const settings = Settings.useSelector(state => ({
    hideIcon: state.hideBirthdateIcon,
    hideTimestamp: state.hideBirthdateTimestamp,
    timestampStyle: state.birthdateTimestampStyle as DiscordTimeFormat
  }));
  
  return <Birthday birthdate={birthdate} {...settings} />;
}