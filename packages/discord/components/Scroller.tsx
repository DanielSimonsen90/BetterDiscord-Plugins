import Finder from "@danho-lib/dium/api/finder";
import { forwardRef } from "@react";

export const ScrollerLooks = Finder.byKeys(['thin', 'fade']) as Record<
  'auto' | 'content' | 'customTheme' 
  | 'disableScrollAnchor' | 'fade' 
  | 'managedReactiveScroller' | 'none' 
  | 'pointerCover' | 'scrolling' 
  | 'thin', 
  string
>;

const ScrollerWrapper = Finder.findBySourceStrings<() => typeof ScrollerAuto>("paddingFix", "getScrollerState");

export const ScrollerAuto: React.ForwardRefExoticComponent<{
  children: React.ReactNode;
  className?: string;
  dir?: 'ltr' | 'rtl';
  orientation?: 'vertical' | 'horizontal';
  paddingFix?: boolean;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
  ref?: React.Ref<HTMLDivElement>;
}> = ScrollerWrapper();