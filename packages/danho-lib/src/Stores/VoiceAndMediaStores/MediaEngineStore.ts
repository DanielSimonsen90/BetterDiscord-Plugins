import type { Snowflake } from "@discord/types/base";
import { Store } from '@dium/modules/flux';
import { Finder } from "@dium/api";
import { BetterOmit } from "../../Utils/types";

export interface MediaEngineStore extends Store {
  getAecDump(): boolean;
  getAttenuateWhileSPeakingOthers(): boolean;
  getAttenuateWhileSpeakingSlef(): boolean;
  getAttenuation(): number;
  getAudioSubsystem(): string;
  getAutomaticGainControl(): boolean;
  getCameraComponent(): CameraComponent;
  getDebugLogging(): boolean;
  getDesktopSource(): undefined;
  getDesktopSourceContext(): string;
  getEchoCancellation(): boolean;
  getEnableSilenceWarning(): boolean;
  getEverSpeakingWileMuted(): boolean;
  getExperimentalEncoders(): boolean;
  getExperimentalSoundshare(): boolean;
  getGraphicsCapture(): boolean;
  getHardwareH264(): boolean;
  getInputDetected(): null;
  getInputDeviceId(): string;
  /** string = inputDeviceId */
  getInputDevices(): Record<string | "default", InputDevice>;
  getInputVolume(): number;
  getLocalPan(id?: string, mediaEngineContextType?: MediaEngineContextTypes): {
    left: number,
    right: number;
  };
  getLocalVolume(id?: string, mediaEngineContextType?: MediaEngineContextTypes): number;
  getLoopback(): boolean;
  getMediaEngine(): MediaEngine;
  getMode(contextType?: MediaEngineContextTypes): string;
  getModeOptions(contextType?: MediaEngineContextTypes): ModeOptions;
  getNoInputDetectedNotice(): boolean;
  getNoiseCancellation(): boolean;
  getNoiseSuppression(): boolean;
  getOpenH264(): boolean;
  getOutputDeviceId(): string;
  /** string = Output device id */
  getOutputDevices(): Record<string, AudioDevice>;
  getOutputVolume(): number;
  getPacketDelay(): number;
  getQoS(): boolean;
  getSettings(contextType?: MediaEngineContextTypes): VoiceInfoSettings;
  getShourcuts(): {};
  getSoundshareEnabled(): number;
  getState(): VoiceInfoState;
  getVideoComponent(): VideoComponent;
  getVideoDeviceId(): string;
  getVideoDevices(): Record<string, InputDevice>;
  getVideoHook(): boolean;
  getVideoStreamParameters(mediaContextType?: MediaEngineContextTypes): Array<{
    rid: string,
    type: string,
    quality: number;
  }>;
  hasContext(): boolean;
  isAdvancedVolumeActivitySupported(): boolean;
  isAecDumpSupported(): boolean;
  isDeaf(): boolean;
  isEnabled(): boolean;
  isExperimentalEncodersSupported(): boolean;
  isHardwareMute(mediaContextType?: MediaEngineContextTypes): boolean;
  isInteractionRequired(): boolean;
  isLocalMute(userId: Snowflake, mediaContextType?: MediaEngineContextTypes): boolean;
  isLocalVideoDisabled(userId: Snowflake, mediaContextType?: MediaEngineContextTypes): boolean;
  isMediaFilterSettingLoading(): boolean;
  isMute(): boolean;
  isNativeAudioPermissionReady(): boolean;
  isNoiseCancellationError(): boolean;
  isNoiseCanellationSupported(): boolean;
  isScreenSharing(): boolean;
  isSelfDeaf(mediaContextType?: MediaEngineContextTypes): boolean;
  isSelfMute(mediaContextType?: MediaEngineContextTypes): boolean;
  isSelfMuteTemporarily(mediaContextType?: MediaEngineContextTypes): boolean;
  isSimulcastSupported(): boolean;
  isSoundSharing(mediaContextType?: MediaEngineContextTypes): boolean;
  isSupported(): boolean;
  isVideoAvailable(): boolean;
  isVideoEnabled(): boolean;
  setCanHavePriority(e: any, t: any): void;
  supports(feature: SupportedFeatures): boolean;
  supportsEnableSoundshare(): boolean;
  supportsExperimentalSoundshare(): boolean;
  supportsGraphicsCapture(): boolean;
  supportsInApp(feature: SupportedFeatures): boolean;
}
export const MediaEngineStore: MediaEngineStore = Finder.byKeys(["isSelfMute", "isNoiseCancellationSupported"]);
export default MediaEngineStore;

export type MediaEngine = {
  Camera: CameraComponent;
  Video: VideoComponent;
  audioLayer: string;
  audioSubsystem: string;
  connections: Set<any>;
  consecutiveWatchdogFailures: number,
  deviceChangeGeneration: number;
  emitter: NodeJS.EventEmitter;
  handleActiveSinkschange(e, t): void;
  handleDeviceChange(audioInput: Array<any>, audioOutput: Array<any>, videoInput: Array<any>): void;
  handleNewListener(mediaEngineEvent: MediaEngineEvent): void;
  handleRemoveListener(mediaEngineEvent: MediaEngineEvent): void;
  handleVideoInputInitialization(e: any): void;
  handleVoiceActivity(e: any, t: any): void;
  /** @assumed */
  handleVolumeChange(inputVolume: number, outputVolume: number): void;
  lastVoiceActivity: number;
  loopback: boolean;
  videoinputDeviceid: string;

  applyMediaFilterSettings(e: any): Promise<any>;
  /** @assumed */
  connect(e: any, t: any, n: any): NodeJS.EventEmitter;
  /** @assumed */
  createReplayConnection(connection: Connection, t: any): NodeJS.EventEmitter;
  destroy(): void;
  eachConnection(callback: (conn: Connection) => void, context?: Context): void;
  enable(): void;
  enableSoundshare(): void;
  getAudioInputDevices(): Promise<Array<AudioDevice>>;
  getAudioLayer(): string;
  getAudioOutputDevices(): Promise<Array<AudioDevice>>;
  getAudioSubsystem(): string;
  getDebugLogging(): boolean;
  /** @error Throws if this.getDesktopSources() returns [] */
  getDesktopSource(): Error | undefined;
  getDesktopSources(): Array<any>;
  getLoopback(): boolean;
  getScreenPreviews<E>(e: E, screenIndex: number): Promise<Array<E & { name: `Screen ${number}`; }>>;
  getSoundshareStatus(): Promise<any>;
  getSupportedVideoCodecs(e: any): any;
  getVideoInputDevices(): Promise<Array<AudioDevice>>;
  getWindowPreviews(e: any, t: any): Promise<Array<any>>;
  interact(): void;
  /**
   * @throws RTC region latency test not supported
   */
  rankRtcRegions(e: any): Promise<any>;
  setAecDump(aecDump: any): void;
  setAudioInputDevice(device: AudioDevice): void;
  setAudioOutputDevice(device: AudioDevice): void;
  setAudioSubsystem(system: AudioSubSystems): void;
  setDebugLogging(logging: boolean): void;
  setDesktopSource(source: any, mediaEngineContextType: MediaEngineContextTypes): void;
  setExperimentalAdm(experimentalAdm: any): void;
  setH246Enabled(enabled: boolean): void;
  setInputVolume(volume: number): void;
  setLoopback(loopback: boolean, options: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
    automaticGainControl: boolean;
    noiseCanellation: boolean;
  }): void;
  setMaxSyncDelayOverride(e: any): void;
  setOutputVolume(volume: number): void;
  setSoundshareSource(e: any, t: any, mediaEngineContextType: MediaEngineContextTypes): void;
  setUseDirectVideo(useDirectVideo: any): void;
  setVideoInputDevice(videoInput: InputDevice): void;
  shouldConnectionBroadcastVideo(connection: Connection): boolean;
  startAecDump(): void;
  stopAecDump(): void;
  supported(): boolean;
  supports(feature: SupportedFeatures): boolean;
  watchdogTick(): boolean | undefined;
  writeAudioDebugState(): Promise<undefined>;
};
export const MediaEngine = MediaEngineStore.getMediaEngine();

export type VideoComponent = React.FunctionComponent<{}>;
export const VideoComponent = MediaEngineStore.getVideoComponent();

export type CameraComponent = React.FunctionComponent<{
  deviceId: string;
  disabled?: boolean;
  width?: number;
  height?: number;
}>;
export const CameraComponent = MediaEngineStore.getCameraComponent();

export enum MediaEngineContextTypes {
  DEFAULT = "default",
  STREAM = "stream",
}
export enum MediaEngineEvent {
  VoiceActivity,
  DeviceChange,
  VideoInputInitialized
}
export enum AudioSubSystems {
  LEGACY
}
export enum SupportedFeatures {
  LEGACY_AUDIO_SUBSYSTEM,
  EXPERIMENTAL_AUDIO_SUBSYSTEM,
  DEBUG_LOGGING,
  SOUNDSHARE,
  ELEVATED_HOOK,
  LOOPBACK,
  WUMPUS_VIDEO,
  HYBRID_VIDEO,
  ATTENUATION, VIDEO_HOOK,
  GRAPHICS_CAPTURE,
  EXPERIMENTAL_SOUNDSHARE,
  OPEN_H246,
  REMOVE_LOCUS_NETWORK_CONTROL,
  SCREEN_PREVIEWS,
  AUDIO_DEBUG_STATE,
  CONNECTION_REPLAY,
  SIMULCAST,
  RTC_REGION_RANKING,
  DIRECT_VIDEO,
  ELECTRON_VIDEO,
  MEDIAPIPE,
  FIXED_KEYFRAME_INTERVAL,
  DIAGNOSTICS, NATIVE_PING, AUTOMATIC_VAD, AUDIO_INPUT_DEVICE, AUDIO_OUTPUT_DEVICE, QOS, VOICE_PROCESSING, AUTO_ENABLE,
  VIDEO, DESKTOP_CAPTURE, DESKTOP_CAPTURE_FORMAT, DESKTOP_CAPTURE_APPLICATIONS, VOICE_PANNING, AEC_DUMP, DISABLE_VIDEO, SAMPLE_PLAYBACK
}

type InputDevice = {
  disabled: boolean;
  id: string;
  index: number;
  name: string;
};
type AudioDevice = BetterOmit<InputDevice, 'disabled'> & {
  originalId: string;
  type: "audioinput";
};

type Connection = {
  ids: {
    userId: Snowflake;
  };
  context: MediaEngineContextTypes,

  setHasActiveVideoOutputSink(e, t): void; // References ln: 117
  hasDesktopSource(): boolean,
};

type Context = {

};

type ModeOptions = {
  audoThreshold: boolean,
  delay: number,
  shortcut: Array<Array<number>>,
  threshold: number,
  vadLeading: number,
  vadTrailing: number;
  vadUseKrisp: boolean;
};

type VoiceInfoSettings = {
  aecDumpenabled: boolean;
  attenuateWhileSpeakingOthers: boolean;
  attenuateWhileSpeakingSelf: boolean;
  attenuation: number;
  automaticGainControl: boolean;
  deaf: boolean;
  disabledLocalVideos: {};
  echoCancellation: boolean;
  experimentalEncoders: boolean;
  experimentalSoundshare2: null;
  fullModeMigrated: boolean;
  graphicsCapture: boolean;
  hardwareH246: boolean;
  inputDeviceId: string;
  inputVolume: number;
  localMutes: Record<Snowflake, boolean>;
  localPans: {},
  localVolumes: Record<Snowflake, number>;
  mode: string;
  modeOptions: ModeOptions;
  mute: boolean;
  ncUseKrispSettingVersion: number,
  noiseCancellation: boolean,
  noiseCancellationmode: string,
  noiseSuppression: boolean,
  openH246: boolean,
  outputDeviceId: string,
  outputVolume: number,
  qos: boolean,
  qosMigrated: boolean,
  silenceWarning: boolean,
  soundshareDucking: number,
  soundshareSettingsVersion: number,
  soundshareVolume: number,
  vadThresholdMigtrated: boolean,
  vadUseKrispSettingVersion: number;
  videoDeviceId: string,
  videoHook: boolean;
};

type VoiceInfoState = {
  appSupported: Record<'VIDEO' | 'DESKTOP_CAPTURE' | 'HYBRID_VIDEO', boolean>,
  desktopSource: undefined,
  desktopSourceContext: string,
  inputDevices: Record<string, InputDevice>,
  krispModuleLoaded: boolean,
  outputDevices: Record<string, InputDevice>,
  settingsByContext: Record<'default' | 'stream', VoiceInfoSettings>,
};