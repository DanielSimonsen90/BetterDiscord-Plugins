import { Patcher, React } from "@dium";
import { GlobalNavigation } from "@discord/components";
import { DanhoBirthdayCalendarKey } from "../../utils/constants";
import { BirthdayCalendarNavItem } from "../../components";

export default function afterGlobalNavigation() {
  Patcher.after(GlobalNavigation, 'Z', ({ result, args: [props] }) => {
    const navItems = result.props.children.props.children;
    if (navItems.some(i => i?.key === DanhoBirthdayCalendarKey)) return;

    navItems.splice(navItems.length - 1, 0, <BirthdayCalendarNavItem /> as any);
  }, { name: 'GlobalNavigation' });
}