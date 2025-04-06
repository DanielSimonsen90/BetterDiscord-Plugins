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
};

export type CustomBadgeData = Omit<CustomBadgeProps, 'key' | 'onContextMenu'> & {
  id: string;
  userTags?: Snowflake[];
  position?: number | 'start' | 'end' | {
    before?: BadgeTypes | string;
    after?: BadgeTypes | string;
    default?: number;
  };
  /** @default 20px */
  size?: `${number}px`;
}

const ClassModule = ClassNamesUtils.combineModuleByKeys<('container' | 'badge')>(['container', 'badge'])

export const CustomBadge: React.FC<CustomBadgeProps> = ({ name, iconUrl, style, href, onContextMenu }) => {
  if (!name || !iconUrl) return null;

  const InnerBadge = ({ href, onContextMenu, ...props }: { href?: string, onContextMenu?: CustomBadgeProps['onContextMenu']; }) => href ? (
    <a href={href} target="_blank" rel="noreferrer noopener" onContextMenu={onContextMenu} {...props}>
      <InnerBadge />
    </a>
  ) : (
    <img onContextMenu={onContextMenu} src={iconUrl} alt={name} className={ClassModule.badge} style={style} {...props} />
  );

  return (
    <Tooltip text={name}>
      {props => (
        <div {...props}>
          <InnerBadge href={href} onContextMenu={onContextMenu} />
        </div>
      )}
    </Tooltip>
  );
}