import listenToChannelSelect from './channelSelect';
import listenToRelationshipAdd from './relationshipAdd';
import listenToUserProfileModalOpen from './userProfileModalOpen';
import listenToVoiceStatesUpdates from './voiceChannelSelect';

export default function listenToActions() {
  listenToChannelSelect();
  listenToRelationshipAdd();
  listenToUserProfileModalOpen();
  listenToVoiceStatesUpdates();
}