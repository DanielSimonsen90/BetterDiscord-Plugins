import type { Timestamp } from "../time";

export type Embed = {
  color: string,
  fields: Array<{
    rawTitle: string,
    rawValue: string,
    inline: boolean,
  }>,
  footer: {
    iconProxyURL?: string,
    iconURL?: string,
    text: string;
  };
  id: string,
  image?: {
    url: string,
    proxyURL: string,
    width: number,
    height: number,
  },
  provider?: {
    name: string,
    url?: string;
  };
  rawDescription?: string,
  rawTitle: string,
  referenceId?: string,
  thumbnail?: {
    url: string,
    proxyURL: string,
    height: number,
    width: number,
  };
  type: string | 'rich' | 'article';
  timestamp?: Timestamp,
  url?: string,
};