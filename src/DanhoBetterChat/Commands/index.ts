import { Logger } from "@discordium/api";
import CommandsModule from "./CommandsModule";
import say from "./say";
import spagSmells from "./spag-smells";

const Commands = (logger: Logger) => new CommandsModule(logger, say, spagSmells);
export default Commands;