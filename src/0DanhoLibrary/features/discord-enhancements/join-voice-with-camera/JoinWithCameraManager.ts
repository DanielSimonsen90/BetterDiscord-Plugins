import { Snowflake } from "@discord/types";

export default class JoinWithCameraManager {
  public static get instance() {
    return this._instance ??= new JoinWithCameraManager();
  }
  private static _instance: JoinWithCameraManager;
  private constructor() {}

  private _channelId: Snowflake | undefined;
  private _shouldEnableCamera: boolean = false;

  public get() {
    return {
      channelId: this._channelId,
      shouldEnableCamera: this._shouldEnableCamera,
    }
  }

  public set(channelId: Snowflake, shouldEnableCamera: boolean) {
    this._channelId = channelId;
    this._shouldEnableCamera = shouldEnableCamera;
  }

  public reset() {
    this._channelId = undefined;
    this._shouldEnableCamera = false;
  }
}