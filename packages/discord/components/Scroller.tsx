import { Finder } from '@injections';
import { forwardRef } from "@react";

export const ScrollerLooks = Finder.byKeys(['thin', 'fade']) as Record<
  'auto' | 'content' | 'customTheme' 
  | 'disableScrollAnchor' | 'fade' 
  | 'managedReactiveScroller' | 'none' 
  | 'pointerCover' | 'scrolling' 
  | 'thin', 
  string
>;

const ScrollerWrapper = Finder.bySourceStrings<() => typeof ScrollerAuto>("paddingFix", "getScrollerState");

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