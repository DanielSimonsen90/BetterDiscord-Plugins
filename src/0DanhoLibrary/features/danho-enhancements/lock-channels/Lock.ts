export default class ChannelLock {
  public static instance(stayUnlockedForMinutes: number, initialState = false) {
    if (!this._instance || this._instance._timeoutDuration !== stayUnlockedForMinutes * 60 * 1000) {
      return this._instance = new ChannelLock(stayUnlockedForMinutes, initialState);
    }

    return this._instance;
  }
  private static _instance: ChannelLock | null = null;

  private constructor(
    stayUnlockedForMinutes: number,
    initialState: boolean
  ) {
    this._locked = initialState;
    this._timeoutDuration = stayUnlockedForMinutes * 60 * 1000;
  }

  private _locked: boolean;
  private _timeout: NodeJS.Timeout;
  private _timeoutDuration: number;

  public get isLocked() {
    return this._locked;
  }
  public lock() {
    this._locked = true;
  }

  public unlock() {
    this._locked = false;

    if (this._timeout) clearTimeout(this._timeout);

    this._timeout = setTimeout(() => {
      if (!this._locked) this._locked = true;
    }, this._timeoutDuration);
  }
}