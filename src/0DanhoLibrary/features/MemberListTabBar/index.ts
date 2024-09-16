import { Settings } from '../../Settings';
import insteadChannelMembers from '../patches/instead/ChannelMembers';

export { default as styles } from './member-list-tab-bar.scss';

export const isMemberListTabBarEnabled = () => Settings.current.memberListTabBar;
export default function Feature() {
  if (!isMemberListTabBarEnabled()) return;

  insteadChannelMembers();
}