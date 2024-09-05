import type { Emoji } from "../guild/emoji";

type BaseActivityType<Type extends number> = {
  id: string,
  name: string,
  state: string,
  type: Type;
};
type Assets = Partial<Record<`${'small' | 'large'}_${'image' | 'text'}`, string>>;
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
    timestamps: { start: string; },
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
    metadata: {
      album_id: string,
      artist_ids: Array<string>,
      context_url: string,
    },
    party: { id: string; },
    sync_id: string,
    timestamps: { start: number, end: number; },
  },
  Watching: Omit<BaseActivityType<3>, 'state'> & {
    created_at: string;
  },
  /** Custom */
  Custom: BaseActivityType<4> & {
    emoji?: Emoji,
    id: "custom",
  },
  /** Competing */
  Competing: BaseActivityType<5> & {
    application_id: string,
    assets: Assets,
    created_at: string,
    details: string,
    url: string,
  }
];