import { React } from '@react';

import { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import GlobalNavigation from "@discord/components/GlobalNavigation";

import BirthdayCalendarNavItem from '../components/BirthdayCalendarNavItem';
import { DanhoBirthdayCalendarKey } from '../constants';

export default createPatcherAfterCallback<GlobalNavigation>(({ result }) => {
  const navItems = result.props.children.props.children;
  if (navItems.some(i => i?.key === DanhoBirthdayCalendarKey)) return;

  navItems.splice(navItems.length, 0, <BirthdayCalendarNavItem /> as any);
})
