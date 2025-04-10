import { ActionsEmitter } from "@actions";
import { JoinWithCameraManager, enableCamera } from "../utils";

export default function onVoiceChannelSelect() {
	ActionsEmitter.on('VOICE_CHANNEL_SELECT', ({ channelId: selectedChannelId }) => {
		const { channelId, shouldEnableCamera } = JoinWithCameraManager.instance.get();
		if (selectedChannelId !== channelId || !shouldEnableCamera) return;

		JoinWithCameraManager.instance.reset();
		enableCamera();	
	});
}