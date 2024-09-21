import { ScrollerAuto, ScrollerLooks } from "@discord/components/Scroller";
import { React, classNames } from "@dium/modules";

type Props<
  TTabKey extends string,
> = {
  tabs: [TTabKey, React.ReactNode][],

  defaultTab?: TTabKey,
  noTabsBackground?: boolean,
  noContentBackground?: boolean,

  beforeTabChange?: (tab: TTabKey) => void,
  onTabChange?: (tab: TTabKey) => void,
} & {
  [key in TTabKey]: React.ReactNode | React.FC;
}

export function TabBar<TTabKey extends string>({ tabs, ...props }: Props<TTabKey>) {
  const { noTabsBackground, noContentBackground } = props;
  const [activeTab, _setActiveTab] = React.useState<TTabKey>(props.defaultTab ?? tabs[0][0]);
  const TabContent: React.FC = typeof props[activeTab as string] === 'function' ? props[activeTab as string] : () => props[activeTab as string];
  const setActiveTab = React.useCallback((tab: TTabKey) => {
    if (props.beforeTabChange) props.beforeTabChange(tab);
    _setActiveTab(tab);
  }, [props.beforeTabChange, props.onTabChange]);

  React.useEffect(() => {
    if (props.onTabChange) props.onTabChange(activeTab);
  }, [activeTab, props.onTabChange]);

  return (
    <div className="tab-bar">
      <div className={classNames('tab-bar__tabs', noTabsBackground && 'tab-bar__tabs--no-color')}>
        {tabs.map(([tab, title]) => <button className={classNames("tab-bar__tab", activeTab === tab && 'tab-bar__tab--active')} key={tab} onClick={() => setActiveTab(tab)}>{title}</button>)}
      </div>
      <div className={classNames('tab-bar__content', noContentBackground && 'tab-bar__content--no-color')}>
        <ScrollerAuto className={classNames(ScrollerLooks.auto, ScrollerLooks.thin, ScrollerLooks.fade)}>
          <TabContent />
        </ScrollerAuto>
      </div>
    </div>
  );
}