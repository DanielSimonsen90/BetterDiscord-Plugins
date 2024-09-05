// import { Role } from "@dium/modules";
import { Snowflake } from "../base";

export interface Role {
  id: Snowflake;
  name: string;

  color: number;
  colorString?: string;
  icon?: any;
  unicodeEmoji?: any;
  tags?: any;

  mentionable: boolean;
  hoist: boolean;
  managed: boolean;
  position: number;
  originalPosition: number;

  permissions: Permissions;
}