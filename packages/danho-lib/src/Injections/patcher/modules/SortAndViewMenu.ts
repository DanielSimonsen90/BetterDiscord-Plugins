import { Channel } from "@discord/types";
import { RenderedMenuItemWithGroup, RenderedMenuItemChildren } from "@context-menus";
import Finder from "../../finder";

export type SortAndViewMenu = JSX.BD.FC<{
  channel: Channel;
  closePopout(e: any): void;
}, {
  children: JSX.BD.Rendered<{
    'aria-label': "Set sort or view",
    children: [
      SortBy: RenderedMenuItemChildren<never, 'Sort by', [
        Recent: RenderedMenuItemWithGroup<'sort-by-recent-activity', "Recently Active", "sort-by">,
        Date: RenderedMenuItemWithGroup<'sort-by-date-posted', "Date Posted", "sort-by">,
      ]>,
      ViewAs: RenderedMenuItemChildren<never, 'View as', [
        List: RenderedMenuItemWithGroup<'view-as-list', "List", "view-as">,
        Grid: RenderedMenuItemWithGroup<'view-as-grid', "Gallery", "view-as">,
      ]>
    ],
    hideScroller: true,
    navId: 'sort-and-view',
    onClose(e: any): void,
    onSelect(e: any): void,
  }>
}, 'div'>

export const SortAndViewMenu = Finder.bySourceStrings<SortAndViewMenu, true>("sort-and-view", { module: true, lazy: true });
export default SortAndViewMenu;