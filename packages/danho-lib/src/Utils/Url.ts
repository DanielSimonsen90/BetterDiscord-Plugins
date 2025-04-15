import Finder from "@danho-lib/dium/api/finder";
import { Snowflake } from "@discord/types";

const InternalDiscordEndpoints: DiscordEndpoints = Finder.findBySourceStrings("ACCOUNT_NOTIFICATION_SETTINGS", "BADGE_ICON")
export const DiscordEndpoints = Object.assign({}, InternalDiscordEndpoints, {
  BADGE_ICON: (icon: string) => `${location.protocol}//${window.GLOBAL_ENV.CDN_HOST}${InternalDiscordEndpoints.BADGE_ICON(icon)}`,
});


export const UrlUtils = {
  DiscordEndpoints,
}
export default UrlUtils;


type DiscordEndpoints = {
  ACCOUNT_NOTIFICATION_SETTINGS: string;
  BADGE_ICON: (icon: string) => string;
  NOTE(userId: Snowflake): string;
} & {
  [key: string]: string | ((...args: any[]) => string);
};