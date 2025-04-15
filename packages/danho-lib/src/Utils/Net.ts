import Finder from "../Injections/finder";
import { Snowflake } from "@discord/types";

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


type DiscordRequestData = {
  url: string;
  query?: Record<string, string> & { type: string } & {
    connections_role_id?: Snowflake;
    friend_token?: string;
    guild_id?: Snowflake;
    join_request_id?: string;
    type: 'popout'; 
    with_mutual_friends?: boolean;
    with_mutual_friends_count?: boolean;
    with_mutual_guilds?: boolean;
  },
  body?: Record<string, any>;
  retries?: number;
  rejectWithError?: boolean;
  oldFormErrors?: boolean;
  signal?: AbortSignal;
}
type DiscordRequester = Record<'post' | 'get' | 'put' | 'patch' | 'del', <T>(data: DiscordRequestData) => Promise<{
  body: T;
  status: number;
}>>
const DiscordRequesterModule: Record<'tn', DiscordRequester> = Finder.bySourceStrings("API_ENDPOINT", "API_VERSION", { module: true });
const DiscordRequester = DiscordRequesterModule.tn;

export const NetUtils = {
  DiscordRequester,
  RatelimitProtector,
}

export default NetUtils;