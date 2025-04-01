import type { Emoji } from "../guild/emoji";

type BaseActivityType<Type extends number> = {
  id: string,
  name: string,
  type: Type;
  created_at: string;
  state?: string,
};
export type Assets = Partial<Record<`${'small' | 'large'}_${'image' | 'text'}`, string>>;
export type TimestampString = `${number}`
export enum ActivityIndexes {
  PLAYING = 0,
  STREAMING = 1,
  LISTENING = 2,
  WATCHING = 3,
  CUSTOM = 4,
  COMPETING = 5,
}
export type ActivityTypes = [
  Playing: BaseActivityType<0> & {
    application_id: string,
    assets: Assets,
    details: string,
    timestamps?: { start: TimestampString; },
  },
  Streaming: BaseActivityType<1> & {
    assets: Assets,
    created_at: string,
    details: string,
    url: string,
  },
  Listening: BaseActivityType<2> & {
    assets: Assets,
    details: string,
    flags: number,
    metadata?: {
      album_id: string,
      artist_ids: Array<string>,
      context_url: string,
    },
    party: { id: string; },
    session_id: string,
    sync_id: string,
    timestamps: { start: TimestampString, end: TimestampString; },
  },
  Watching: Omit<BaseActivityType<3>, 'state'> & {},
  Custom: BaseActivityType<4> & {
    emoji?: Emoji,
    id: "custom",
  },
  Competing: BaseActivityType<5> & {
    application_id: string,
    assets: Assets,
    created_at: string,
    details: string,
    url: string,
  }
];

export type Activity = ActivityTypes[number];
export type PlayingActivity = ActivityTypes[ActivityIndexes.PLAYING];
export type StreamingActivity = ActivityTypes[ActivityIndexes.STREAMING];
export type ListeningActivity = ActivityTypes[ActivityIndexes.LISTENING];
export type WatchingActivity = ActivityTypes[ActivityIndexes.WATCHING];
export type CustomActivity = ActivityTypes[ActivityIndexes.CUSTOM];
export type CompetingActivity = ActivityTypes[ActivityIndexes.COMPETING];