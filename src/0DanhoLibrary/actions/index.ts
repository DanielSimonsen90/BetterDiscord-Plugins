import listenToChannelSelect from './channelSelect';
import listenToRelationshipAdd from './relationshipAdd';
import listenToVoiceStatesUpdates from './voiceChannelSelect';

export default function listenToActions() {
  listenToChannelSelect();
  listenToRelationshipAdd();
  listenToVoiceStatesUpdates();
}