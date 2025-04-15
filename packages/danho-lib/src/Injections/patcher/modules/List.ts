import { GuildMember, Snowflake } from "@discord/types";
import Finder from "../../finder";

type ListSpacer = JSX.BD.Rendered<{
  'aria-hidden': true,
  style: React.CSSProperties,
}>;
type WhosOnline = JSX.BD.Rendered<{
  children: JSX.BD.Rendered<{
    count: number;
    guildId: Snowflake;
    index: number;
    /** Role name */
    title: string;
    type: 'GROUP';
  }>,
  inlineSpecs: {
    offset: Record<'x' | 'y', number>;
    origin: Record<'x' | 'y', number>;
    targetHeight: number;
    targetWidth: number;
  },
  position: 'left',
  tutorialId: 'whos-online';
}>;
type MemberItem = JSX.BD.Rendered<GuildMember>

export type MemberList = JSX.BD.FRC<{
  className: 'members_...',
  customTheme: boolean,
  'data-jump-section': 'global',
  'data-list-id': `members-${number}`,
  fade: boolean,
  innerAriaLabel: 'Members',
  innerRole: 'list',
  onKeyDown: (event: KeyboardEvent) => void,
  onScroll: (event: Event) => void,
  paddingTop: number,
  renderRow: (e: any) => JSX.BD.Rendered;
  renderSection: (e: any) => JSX.BD.Rendered;
  rowHeight: number;
  sectionHeight: number;
  sections: Array<number>;
  tabIndex: number;
}, {
  children: [
    JSX.BD.Rendered<{
      'aria-label': 'Members',
      'aria-multiseectable': undefined,
      'aria-orientation': undefined,
      children: JSX.BD.Rendered<{
        containerRef: React.RefObject<HTMLElement>;
        children: Array<ListSpacer | WhosOnline | MemberItem>;
      }>,
      className: 'content__...',
      id: undefined,
      role: 'list',
      style: React.CSSProperties,
    }>,
    null
  ],
  className: 'members_...',
  customTheme: boolean,
  'data-jump-section': 'global',
  'data-list-id': `members-${number}`,
  onKeyDown: (event: KeyboardEvent) => void,
  onScroll: (event: Event) => void,
  style: React.CSSProperties,
  tabIndex: number;
}>

export const ForumPostListModule: Record<'Tvr', MemberList> = Finder.bySourceStrings("getItems", "stickyListHeader", "isSidebarVisible", { module: true });
export default ForumPostListModule;