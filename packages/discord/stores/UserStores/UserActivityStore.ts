import type { ActivityIndexes, ActivityTypes } from '@discord/types/user/activity';
import { Finder } from '@injections';
import { Store } from '@dium/modules/flux';

export interface UserActivityStore extends Store {
    canPlay(e: any): boolean;
    getActiveSocketAndDevice(): {
        device: Device,
        socket: Socket
    };
    getActivity<ActivityType extends ActivityIndexes = number>(): ActivityTypes[ActivityType];
    getLastPlayedTrackId(): string | undefined;
    getPlayableComputerDevices(): Device[];
    getPlayerState(e: any): any;
    getSyncingWith(): any | undefined;
    getTrack(): Track;
    hasConnectedAccount(): boolean;
    shouldShowActivity(): boolean;
    wasAutoPaused(): boolean;
}

export const UserActivityStore = Finder.byKeys<UserActivityStore>(["getUser", "getCurrentUser"]);
export default UserActivityStore;

type Device = {
    id: string,
    is_active: boolean,
    is_private_session: boolean,
    is_restricted: boolean,
    name: string,
    type: string,
    volume_percent: number,
}

interface Socket {
    accessToken: string,
    accountId: string,
    backoff: {
        jitter: boolean,
        max: number,
        min: number,
        get _callback(): null
        get current(): number
        get fails(): number
        get pending(): boolean

        cancel(): void,
        fail(e: any): void,
        succeed(): void,
    },
    connectionId: string,
    handleDeviceStateChange(): void,
    isPremium: boolean,
    pingInterval: { _ref: number },
    socket: WebSocket,
    _requestedConnect: boolean,
    _requestedDisconnect: boolean,
    connected: boolean,

    connect(): void,
    disconnect(): void,
    handleClose(): void,
    handleEvnet(e: any): void,
    handleMessage(e: any): void,
    handleOpen(): void,
    ping(): number,
}

type Album = {
    id: string,
    name: string,
    image: {
        height: number,
        url: string,
        width: number,
    }
}
type Artist = {
    external_urls: { spotify: string },
    href: string,
    id: string,
    name: string,
    type: "artist",
    uri: string,
}
type Track = {
    album: Album,
    artists: Array<Artist>
    duration: number,
    id: string,
    isLocal: boolean,
    name: string
}