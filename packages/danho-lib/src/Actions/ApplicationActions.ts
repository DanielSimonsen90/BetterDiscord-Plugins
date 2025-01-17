import Finder from "@danho-lib/dium/api/finder";
import { Snowflake } from "@discord/types";
import { Application } from "@stores/ApplicationStore";

export type ApplicationActions = {
  createApplication(e: any): Application
  fetchApplication(applicationId: string): Promise<Application>;
  fetchApplications(applicationIds: Array<string>): Promise<Application[]>;
  getApplicationsForGuild(guildId: Snowflake): Application[];
  transferApplication(e: any): any;
};

export const ApplicationActions = Finder.findBySourceStrings<ApplicationActions>("fetchApplications", "createApplication");
export default ApplicationActions;