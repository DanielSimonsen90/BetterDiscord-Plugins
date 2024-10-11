import { 
  React, 
  Dispatch, ReactNode, SetStateAction, 
  useCallback, useEffect, useMemo, useState 
} from "../React";
import { classNames } from "@dium/modules";
import { Functionable } from "@danho-lib/Utils/types";

type Props<
  TTabKey extends string,
> = {
  defaultTab?: TTabKey,
  tabs: [TTabKey, ReactNode][],

  tab?: TTabKey,
  setTab?: Dispatch<SetStateAction<TTabKey>>,

  id?: string,
  children?: ReactNode,

  beforeTabChange?: (tab: TTabKey) => void,
  onTabChange?: (tab: TTabKey) => void,
} & Record<TTabKey, Functionable<ReactNode>> & {
  className?: string,
};

export function TabBar<TTabKey extends string>({ tabs, ...props }: Props<TTabKey>) {
  const [activeTab, _setActiveTab] = useState<TTabKey>(
    props.defaultTab
    ?? tabs.filter(([_, value]) => value)[0][0]
  );

  const internalTabs = useMemo(() => {
    const set = tabs
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => acc.set(key, value), new Map<TTabKey, ReactNode>());
    return [...set.entries()];
  }, [tabs, props.id]);

  const getKeyName = useCallback((key: any) => props.id ? `#${props.id}-${key}` : key, [props.id]);
  const TabContent = useCallback(function TabContent() {
    const contentChildren = internalTabs.map(([tab]) => [tab, typeof props[tab as keyof typeof props] === 'function'
      ? props[tab as keyof typeof props] as () => JSX.Element
      : () => props[tab as keyof typeof props] as JSX.Element] as const);

    return (<>{contentChildren.map(([tab, Content], key) => (
      <div key={getKeyName(`content-${key}`)} className={classNames("tab-bar__content-page", tab === (props.tab ?? activeTab) && 'tab-bar__content-page--active')}>
        <Content />
      </div>
    ))}</>);
  }, [tabs, activeTab, props.tab]);
  const setActiveTab = useCallback((tab: TTabKey) => {
    if (!tab) return;
    if (props.beforeTabChange) props.beforeTabChange(tab);
    (props.setTab ?? _setActiveTab)(tab);
  }, [props.beforeTabChange, props.setTab]);

  useEffect(function onTabChanged() {
    if (props.onTabChange) props.onTabChange(props.tab ?? activeTab);
  }, [activeTab, props.tab, props.onTabChange]);

  useEffect(function onTabsOptionsChanged() {
    // if active tab key is not in tabs or the value is falsy, set it to the first tab
    if (!tabs.find(([key]) => key === (props.tab ?? activeTab))?.[1]) {
      setActiveTab(tabs[0][0] as TTabKey);
    }
  }, [tabs]);

  useEffect(function onControlledTabChanged() {
    if (props.tab) setActiveTab(props.tab);
  }, [props.tab]);

  return (
    <div id={props.id} className={classNames("tab-bar", props.className)}>
      <header className={classNames('tab-bar__tabs')}>
        {internalTabs.map(([tab, title]) => title &&
          <button key={getKeyName(tab)}
            className={classNames("tab-bar__tab", activeTab === tab && 'tab-bar__tab--active')}
            onClick={() => setActiveTab(tab)}
          >
            {title}
          </button>)}
        {props.children}
      </header>
      <section className={classNames('tab-bar__content')}>
        <TabContent />
      </section>
    </div>
  );
}