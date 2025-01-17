import { ChannelItem } from '@danho-lib/Patcher/ChannelItem';
import { Patcher } from '@dium';

import addJoinWithCameraDoubleClick from 'src/0DanhoLibrary/features/discord-enhancements/join-voice-with-camera/afterChannelItem';
import { Settings } from 'src/0DanhoLibrary/Settings';

export default function afterChannelItem() {  
  if (!Settings.current.joinVoiceWithCamera) return;

  Patcher.after(ChannelItem, 'Z', (...args) => {
    if (Settings.current.joinVoiceWithCamera) addJoinWithCameraDoubleClick(...args);
  }, { name: 'ChannelItem' });
}