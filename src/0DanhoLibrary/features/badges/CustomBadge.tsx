import { $ } from "@danho-lib/DOM";
import { BadgeTypes, UserProfileBadgeList } from "@discord/components/UserProfileBadgeList";
import { Snowflake } from "@discord/types/base";
import { React } from "@dium/modules";

export type CustomBadgeProps = {
  name: string;
  iconUrl: string;
  style?: React.CSSProperties;
};

export type CustomBadgeData = CustomBadgeProps & {
  userTags?: Snowflake[];
  position?: number | 'start' | 'end' | {
    before?: BadgeTypes;
    after?: BadgeTypes;
    default?: number;
  };
  /** @default 20px */
  size?: `${number}px`;
}

export let CustomBadge: JSX.BD.FC<CustomBadgeProps> & React.FC<CustomBadgeProps> = null;
export function patchBadgeComponent(result: ReturnType<UserProfileBadgeList<true>>) {
  if (!result.props.children[0]) return;
  const TooltipWrapper = result.props.children[0].type as React.FC<
    Partial<{
      delay: 300;
      onTooltipHide: () => void;
      onTooltipShow: () => void;
      tooltipClassName: string;
    }> & {
      children: ReturnType<typeof CustomBadge>;
      text: string;
    }
  >;
  const TooltipContent = result.props.children[0].props.children.type as React.FC<{
    children: [
      JSX.IntrinsicElements['img'],
      boolean // ???
    ],
  }>;

  CustomBadge = ({ name, iconUrl, style }: CustomBadgeProps) => {
    if (!name || !iconUrl) return null;

    return (
      <TooltipWrapper text={name}>
        <TooltipContent>
          <img src={iconUrl} alt={name} className={result.props.children[0].props.children.props.children[0].props.className} style={style} />
          {false}
        </TooltipContent>
      </TooltipWrapper>
    ) as any;
  }
}
export function insertBadges(result: ReturnType<UserProfileBadgeList<true>>, badgeData: CustomBadgeData[]) {
  if (!result) return;
  if (result.props.children.some(badge => badge.type === CustomBadge)) return;
  const badges = result.props.children as Array<typeof result.props.children[0]>

  const newBadges = badgeData
    .filter(({ userTags }) => userTags ? checkUserId(userTags) : true)
    .sort((a, b) => getPosition(a.position) - getPosition(b.position))
    .map(({ size, position, ...props }) => [position, <CustomBadge key={props.name} {...props} style={{ width: size, height: size }} />] as const);
  
  for (const [position, badge] of newBadges) {
    badges.splice(getPosition(position), 0, badge as any);
  }

  function checkUserId(userTags: Snowflake[]) {
    const userTag = $(s => s.role('dialog').className('userTag'))?.value.toString() // Modal/Popout
      ?? $(s => s.className('userProfileOuter').className('userTag'))?.value.toString() // DM sidebar
      ?? $(s => s.className('accountProfileCard').className('usernameInnerRow'), false)
        .map(dq => dq.children(undefined, true).value.toString())[1]; // User Settings -- Discord uses "usernameInnerRow" on "Display Name" and "Username"

    return userTags.includes(userTag);
  }
  function getPosition(position: CustomBadgeData['position']) {
    if (position === undefined ||position === 'end') return badges.length;
    if (position === 'start') return 0;
    if (typeof position === 'number') return position;

    const [startIndex, endIndex] = [position.before, position.after].map((badgeType, i) => badgeType
      ? badges.findIndex(badge => badge.props.text.toLowerCase().includes(badgeType.toLowerCase())) + i
      : -1
    );

    return startIndex === -1 && endIndex === -1 && position.default === undefined ? badges.length // Indexes failed; default to end
    : startIndex === -1 && position.default === undefined ? endIndex  // Start index not provided; use end index
    : endIndex === -1 && position.default === undefined ? startIndex  // End index not provided; use start index
    : position.default === undefined ? Math.max(startIndex, endIndex) - Math.min(startIndex, endIndex) // Both indexes provided; use the difference
    : position.default ?? badges.length; // Use default index if provided, otherwise use end
  }
}