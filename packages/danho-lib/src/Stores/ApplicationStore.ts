import Finder from "@danho-lib/dium/api/finder";
import { Guild, Snowflake, User } from "@discord/types";
import { Store } from "@dium/modules/flux";

type ApplicationStore = Store & {
  didFetchingApplicationFail(e: any): boolean;
  getAppIdForBotUserid(id: Snowflake): string | null;
  getApplication(id: string): Application | null;
  getApplicationByName(name: string): Application | null;
  getApplicationLastUpdated(id: string): number;
  getFetchingOrFailedFetchingIds(): string[];
  getGuildApplication(guildId: Snowflake, type: number): Application | null;
  getGuildApplicationIds(guildId: Snowflake): string[];
  getState(): {
    botUserIdToAppUsage: {};
  };
  isFetchingApplication(id: string): boolean;
  _getAllApplications(): Application[];
};

export const ApplicationStore: ApplicationStore = Finder.byName("ApplicationStore");

export type Application = {
  aliases: string[];
  bot: User;
  coverImage: null | string;
  description: null | string;
  developers: [];
  embeddedActivityConfig: undefined;
  eulaId: null;
  executeables: Array<{
    os: string;
    name: string;
    isLauncher: boolean;
  }>;
  flags: number;
  guild: null | Guild;
  guildId: null | Snowflake;
  hashes: [];
  hook: boolean;
  icon: string;
  id: string;
  installParams: undefined;
  integrationtypesConfig: {
    0: { oauth2InstallParams: undefined; };
  };
  isMonetized: boolean;
  isverified: boolean;
  maxParticipants: undefined | number;
  name: string;
  overlay: boolean;
  overlayCompativilityHook: boolean;
  overlayMethods: number;
  overlayWarn: boolean;
  primarySkuId: undefined | string;
  privacyPolicyUrl: undefined | string;
  publishers: [];
  roleConnectionsverificationUrl: undefined | string;
  slug: null | string;
  splash: null | string;
  storeListingSkuId: undefined | string;
  storefront_available: boolean;
  tags: [];
  team: undefined;
  termsOfServiceUrl: undefined | string;
  thirdPartySkus: Array<{
    id: `${number}`;
    sku: `${number}`;
    distributor: 'steam' | string;
  }>
  type: number;

  get destinationSkuId(): undefined | string;
  get supportsOutOfProcessOverlay(): boolean;

  getCoverImageUrl(e: any): string | null;
  getIconSource(e: any, t: any): string | null;
  getIconURL(e: any, t: any): string | null;
  getMaxParticipants(): Application['maxParticipants']
  getSplashURL(e: any, t: any): string | null;
  supportsIntegrationTypes(): boolean;
};