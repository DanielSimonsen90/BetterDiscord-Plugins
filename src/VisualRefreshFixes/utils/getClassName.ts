import { classNames } from '@react';
import { Settings } from '../settings/Settings';

export default function getClassName() {
  const settings = Settings.current;
  
  return classNames(
    settings.alignUserAreaPanelsAndChannelTextArea && 'danho-align-user-area-panels-and-channel-text-area',
    settings.roundGuildIcons && 'danho-round-guild-icons',
    settings.sharpenButtons && 'danho-sharpen-buttons',
    settings.giveLastMessageMoreSpace && 'danho-give-last-message-more-space',
    settings.groupPrivateChannelNavOptions && 'danho-group-private-channel-nav-options',
  );
}