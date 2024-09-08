import { Finder } from "@dium/api";

type CollapsibleProps = {
  children: React.FC<never>;
  collapsibleContent: React.ReactNode;
  isExpanded: boolean;
  className?: string;
}

type CollapseListIconProps = {
  size?: 'md' | 'lg' | 'xl' | 'sm';
  width: number;
  height: number;
  color?: string;
  colorClass?: string;
} & React.SVGProps<SVGSVGElement>;

export const Collapsible: React.FC<CollapsibleProps> = Finder.byKeys(["Collapsible"]).Collapsible;
export const CollapseListIcon: React.FC<CollapseListIconProps> = Finder.byKeys(["CollapseListIcon"]).CollapseListIcon;