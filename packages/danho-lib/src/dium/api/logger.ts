import * as diumLogger from '@dium/api/logger';
import { getMeta } from '@dium/meta';

export * from '@dium/api/logger';
export const debugLog = (...data: any[]) => getMeta().development ? diumLogger.log(...data) : undefined;

export const Logger = {
  ...diumLogger,
  debugLog,
};