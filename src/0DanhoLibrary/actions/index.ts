import listenToChannelSelect from './channelSelect';
import listenToVoiceStatesUpdates from './voiceChannelSelect';

export default function listenToActions() {
  listenToChannelSelect();
  listenToVoiceStatesUpdates();
}