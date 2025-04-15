import * as diumLogger from '@dium/api/logger';
import { getMeta } from '@dium/meta';

export * from '@dium/api/logger';

const debugLog = (...data: any[]) => getMeta().development ? diumLogger.log(...data) : undefined;
const debugWarn = (...data: any[]) => getMeta().development ? diumLogger.warn(...data) : undefined;
const debugError = (...data: any[]) => getMeta().development ? diumLogger.error(...data) : undefined;

export const createLogger = (name?: string) => {
  if (name) {
    const prefix = `[${name}]`;

    return {
      ...diumLogger,
      log: (...data: any[]) => diumLogger.log(prefix, ...data),
      warn: (...data: any[]) => diumLogger.warn(prefix, ...data),
      error: (...data: any[]) => diumLogger.error(prefix, ...data),
      debugLog: (...data: any[]) => debugLog(prefix, ...data),
      debugWarn: (...data: any[]) => debugWarn(prefix, ...data),
      debugError: (...data: any[]) => debugError(prefix, ...data),
    };
  }

  return {
    ...diumLogger,
    debugLog,
    debugWarn,
    debugError,
  };
}

export const Logger = createLogger();