import { ContextMenuItemProps as BaseContextMenuItemProps } from "betterdiscord";
import type React from "react";

export type ContextMenuItemProps = BaseContextMenuItemProps & {
  color?: string | 'default' | 'danger' | 'brand' | 'primary' | 'secondary' | 'success' | 'warning';
  label: string;
  icon?: React.FC<{ color?: string | 'currentColor' }>
  iconLeft?: boolean;
  /** @default md */
  iconLeftSize?: 'sm' | 'md' | 'lg';
  hint?: string;
  subtext?: string;
  subtextLineClamp?: number;
  hasSubmenu?: boolean;
  disabled?: boolean;
  /** @default true */
  isFocused?: boolean;
  menuItemProps?: React.HTMLProps<HTMLDivElement>;
  action: () => void;
  onClose: () => void;
  onFocus?: () => void;
  className?: string;
  focusedClassName?: string;
  subMenuIconClassName?: string;
  dontCloseOnActionIfHoldingShiftKey?: boolean;
  dontCloseOnAction?: boolean;
  iconProps?: Record<string, any>;
  sparkle?: boolean;
  /** @default true */
  extended?: boolean;
}

export type RenderedMenuItem<id, label, action = (() => void)> = JSX.BD.Rendered<{
  action: action,
  id: id,
  label: label,
}>;

export type RenderedMenuItemChildren<id, label, children> = JSX.BD.Rendered<{
  children: children,
  id: id,
  label: label,
}>;