import { React } from "@react";
import { BadgeTypes, BadgeList } from "@discord/components/UserProfileBadgeList";
import { Snowflake } from "@discord/types/base";

export type CustomBadgeProps = {
  name: string;
  iconUrl: string;
  style?: React.CSSProperties;
  href?: string;
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
export function patchBadgeComponent(result: ReturnType<BadgeList>) {
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
    children: JSX.IntrinsicElements['img' | 'a'],
  }>;

  CustomBadge = ({ name, iconUrl, style, href }: CustomBadgeProps) => {
    if (!name || !iconUrl) return null;

    const InnerBadge = ({ href }: { href?: string }) => href ? (
      <a href={href} target="_blank" rel="noreferrer noopener">
        <InnerBadge />
      </a>
    ) : (
      <img src={iconUrl} alt={name} className={result.props.children[0].props.children.props.children.props.className} style={style} />
    )

    return (
      <TooltipWrapper text={name}>
        <TooltipContent>
          <InnerBadge href={href} />
        </TooltipContent>
      </TooltipWrapper>
    ) as any;
  }
}