import { Finder } from "@dium/api";

export const ScrollerLooks = Finder.byKeys(['thin', 'fade']) as Record<
  'auto' | 'content' | 'customTheme' 
  | 'disableScrollAnchor' | 'fade' 
  | 'managedReactiveScroller' | 'none' 
  | 'pointerCover' | 'scrolling' 
  | 'thin', 
  string
>;

export const ScrollerAuto: React.ForwardRefRenderFunction<any, {
  children: React.ReactNode;
  className?: string;
  dir?: 'ltr' | 'rtl';
  orientation?: 'vertical' | 'horizontal';
  paddingFix?: boolean;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}> = Finder.byKeys(['ScrollerAuto']).ScrollerAuto;