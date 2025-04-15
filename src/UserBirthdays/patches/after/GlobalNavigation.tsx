import { Patcher, React } from "@dium";
import { GlobalNavigation } from "@discord/components";
import { DanhoBirthdayCalendarKey } from "../../utils/constants";
import { BirthdayCalendarNavItem } from "../../components";

export default function afterGlobalNavigation() {
  Patcher.after(GlobalNavigation, 'Z', ({ result, args: [props] }) => {
    let navItems = result.props.children.props.children;
    const hasVisualRefreshFixNav = navItems.some(i => 'className' in i.props && i.props.className === "danho-nav-group")
    const isCalendarAdded = hasVisualRefreshFixNav
      ? (navItems[0].props as any).children.some((i: any) => i?.key === DanhoBirthdayCalendarKey)
      : navItems.some((i: any) => i?.key === DanhoBirthdayCalendarKey);
    if (isCalendarAdded) return;
      
    if (hasVisualRefreshFixNav) {
      // @ts-ignore
      navItems = navItems[0].props.children;
    }

    navItems.splice(navItems.length - 1, 0, <BirthdayCalendarNavItem key={DanhoBirthdayCalendarKey} /> as any);
  }, { name: 'GlobalNavigation' });
}