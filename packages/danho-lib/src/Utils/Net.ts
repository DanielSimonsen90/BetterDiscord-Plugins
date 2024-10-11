export const RatelimitProtector = new class RatelimitProtector {
  private _promise: Promise<any> = null;

  async execute<T>(call: () => Promise<T>): Promise<T> {
    if (this._promise) {
      return await this._promise;
    }

    this._promise = call();
    const result = await this._promise;
    this._promise = null;
    return result;
  }
}