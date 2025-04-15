import { Snowflake } from "@discord/types/base";
import { Finder } from "@injections";
import { Store } from "@dium/modules/flux";

export interface ContentInventoryStore extends Store {
  getFeeds(): Map<'global feed', FeedItem>;
}
export const ContentInventoryStore = Finder.byName<ContentInventoryStore>("ContentInventoryStore");

export interface FeedItem {
  entries: FeedEntry[];
  entries_hash: number;
  expired_at: string;
  refresh_stale_inbox_after_ms: number;
  refresh_token: string;
  request_id: string;
  wait_ms_until_next_fetch: number;
}

export interface FeedEntry {
  rank: number;
  content: GameContent | ListeningContent;
}

interface BaseContent {
  author_id: Snowflake;
  author_type: number;
  content_type: number;
  expires_at: string;
  id: Snowflake;
  participants: Snowflake[];
  signature: {
    kid: string;
    signature: string;
    version: number;
  }
  traits: Array<Trait>;
  extra: {
    type: string;
  }
}

export interface GameContent extends BaseContent {
  extra: {
    application_id: Snowflake;
    game_name: string;
    platform: number;
    type: "played_game_extra"
  }
  started_at: string;
}

export interface ListeningContent extends BaseContent {
  extra: {
    entries: Array<ListeningContentExtraItem>;
    last_update: string;
    type: 'listened_session_extra';
  }
}

export type Traits = {
  1: { first_time: boolean }
  2: { duration_seconds: number }
  3: { is_live: boolean }
  4: any;
  5: { resurrected_last_played: string }
  6: { marathon: boolean }
  7: any;
  8: { streak_count_days: number }
  9: { tending: number }
}

export type Trait = Traits[1] | Traits[2] | Traits[3] | Traits[5] | Traits[6] | Traits[8] | Traits[9];

export type ListeningContentExtraItem = {
  media: {
    artists: Array<{ name: string, external_id: string }>;
    external_id: string;
    external_parent_id: string;
    image_url: string;
    media_type: number;
    parent_title: string;
    provider: number;
    title: string;
    type: 'listened_media_extra';
  },
  repeat_count: number;
  verification_state: number;
}
