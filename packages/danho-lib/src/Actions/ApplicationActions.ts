import { Finder } from '@injections';
import { Snowflake } from "@discord/types";
import { Application } from "@discord/stores/AppStores/ApplicationStore";

export type ApplicationActions = {
  createApplication(e: any): Application
  fetchApplication(applicationId: string): Promise<Application>;
  fetchApplications(applicationIds: Array<string>): Promise<Application[]>;
  getApplicationsForGuild(guildId: Snowflake): Application[];
  transferApplication(e: any): any;
};

export const ApplicationActions = Finder.bySourceStrings<ApplicationActions>("fetchApplications", "createApplication");
export default ApplicationActions;