import listenToChannelSelect from './channelSelect';
import listenToRelationshipAdd from './relationshipAdd';
import listenToVoiceStatesUpdates from './voiceStateUpdates';

export default function listenToActions() {
  listenToChannelSelect();
  listenToRelationshipAdd();
  listenToVoiceStatesUpdates();
}