import Finder from "@danho-lib/dium/api/finder";
import { Autocomplete } from "@danho-lib/Utils/types";
import { Channel, Snowflake } from "@discord/types";

type NavigationItem<Key> = JSX.BD.Rendered<{
  selected: boolean
}, (e: any) => JSX.BD.Rendered> & {
  key: Autocomplete<Key>,
}

export type GlobalNavigation = JSX.BD.FC<{
  children: JSX.BD.Rendered<{
    channels: Array<Channel>
    children: [
      friends: NavigationItem<'friends'>,
      null,
      null,
      premium: NavigationItem<'premium'>,
      discordShop: NavigationItem<'discord-shop'>,
      null,
      null,
      null
    ],
    listRef: Record<'current', {
      getItems(): any[];
      mergeTo(e: any): any;
      scrollIntoViewNode(t: any): void;
      scrollIntoViewRect(e: any): void;
      scrollPageDown(): void;
      scrollPageUp(): void;
      scrollTo(e: any): void;
      scrollToBottom(): void;
      scrollToIndex(index: number): void;
      scrollToTop(): void;
    }>,
    privateChannelIds: Array<Snowflake>
  }>
}>

export const GlobalNavigation: { Z: GlobalNavigation } = Finder.findBySourceStrings("ConnectedPrivateChannelsList", { defualtExport: false });
export default GlobalNavigation;