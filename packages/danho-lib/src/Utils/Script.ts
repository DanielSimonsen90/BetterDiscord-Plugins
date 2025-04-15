import chalk from "chalk";
import minimist from "minimist";

const success = (msg: string) => console.log(chalk.green(msg));
const log = (msg: string) => console.log(msg);
const warn = (msg: string) => console.warn(chalk.yellow(`Warn: ${msg}`));
const error = (msg: string) => console.error(chalk.red(`Error: ${msg}`));

export const Logger = { success, log, warn, error };

export const killIfTrue = (condition: boolean, msg: string) => {
  if (condition) {
    error(msg);
    process.exit(1);
  }
};
export const createMinimistBooleanArgs = (key: string, keyPlural: string) => [
  `with${key.charAt(0).toUpperCase() + key.slice(1)}`,
  `with-${key}`,
  key
].concat([
  `with${keyPlural.charAt(0).toUpperCase() + keyPlural.slice(1)}`,
  `with-${keyPlural}`,
  keyPlural
]);

export const hasMinimistBooleanArg = (args: minimist.ParsedArgs, key: string, keyPlural: string) => {
  return createMinimistBooleanArgs(key, keyPlural).some(arg => args[arg]);
};

export type ProjectInfo = {
  repository: string;
  bugs: string;
};