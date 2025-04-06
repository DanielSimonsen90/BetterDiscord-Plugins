import { React } from "@react";
import { BadgeTypes, BadgeList } from "@discord/components/UserProfileBadgeList";
import { Snowflake } from "@discord/types/base";
import { Tooltip } from "@discord/components";
import { ClassNamesUtils } from "@danho-lib/Utils/ClassNames";

export type CustomBadgeProps = {
  key: string;
  onContextMenu?: (e: React.MouseEvent) => void;
  
  name: string;
  iconUrl: string;
  style?: React.CSSProperties;
  href?: string;

  /** @default 20px */
  size?: `${number}px`;
};

export type CustomBadgeData = Omit<CustomBadgeProps, 'key' | 'onContextMenu'> & {
  id: string;
  userTags?: Snowflake[];
}

const ClassModule = ClassNamesUtils.combineModuleByKeys<('container' | 'badge')>(['container', 'badge'])

export const CustomBadge: React.FC<CustomBadgeProps> = ({ name, iconUrl, style, href, onContextMenu, size }) => {
  if (!name || !iconUrl) return null;

  const compiledStyle = Object.assign({}, style, {
    width: style?.width ?? size,
    height: style?.height ?? size,
  })

  const BadgeIcon = () => <img src={iconUrl} alt={name} className={ClassModule.badge} style={compiledStyle} />
  const AnchorBadge = () => (
    <a href={href} target="_blank" rel="noreferrer noopener">
      <BadgeIcon />
    </a>
  );

  return (
    <Tooltip text={name}>
      {props => (
        <div {...props} onContextMenu={onContextMenu}>
          {href ? <AnchorBadge /> : <BadgeIcon />}
        </div>
      )}
    </Tooltip>
  );
}