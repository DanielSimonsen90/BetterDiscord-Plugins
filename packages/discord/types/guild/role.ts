// import { Role } from "@dium/modules";
import { Snowflake } from "../base";

export interface Role {
  id: Snowflake;
  name: string;

  color: number;
  colors: {
    primary_color: number;
    secondary_color: null | number;
    tertiary_color: null | number;
  }
  colorStrings: {
    primaryColor: string;
    secondaryColor: undefined | string;
    tertiaryColor: undefined | string;
  }
  colorString?: string;
  icon?: string;
  unicodeEmoji?: null;
  tags?: {};

  mentionable: boolean;
  hoist: boolean;
  managed: boolean;
  position: number;
  originalPosition: number;

  permissions: Permissions;
}