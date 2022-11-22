import path from "path";
import {promises as fs, readdirSync, readFileSync} from "fs";
import minimist from "minimist";
import chalk from "chalk";

import * as rollup from "rollup";
import styleModules from "./style-modules";
import rollupConfig from "../rollup.config";

import type {Meta} from "betterdiscord";

const repo = "Zerthox/BetterDiscord-Plugins";

const success = (msg: string) => console.log(chalk.green(msg));
const warn = (msg: string) => console.warn(chalk.yellow(`Warn: ${msg}`));
const error = (msg: string) => console.error(chalk.red(`Error: ${msg}`));

// find sources
const sourceFolder = path.resolve(__dirname, "../src");
const sourceEntries = readdirSync(sourceFolder, {withFileTypes: true}).filter((entry) => entry.isDirectory());
const wscript = readFileSync(path.resolve(__dirname, "wscript.js"), "utf8").split("\n").filter((line) => line.trim().length > 0).join("\n");

// parse args
const args = minimist(process.argv.slice(2), {boolean: ["dev", "watch"]});

// resolve input paths
let inputPaths: string[] = [];
if (args._.length === 0) {
    inputPaths = sourceEntries.map((entry) => path.resolve(sourceFolder, entry.name));
} else {
    for (const name of args._) {
        const entry = sourceEntries.find((entry) => entry.name.toLowerCase() === name.toLowerCase());
        if (entry) {
            inputPaths.push(path.resolve(sourceFolder, entry.name));
        } else {
            warn(`Unknown plugin "${name}"`);
        }
    }
}

// check for inputs
if (inputPaths.length === 0) {
    error("No plugin inputs");
    process.exit(1);
}

// resolve output directory
const outDir = args.dev ? path.resolve(
    process.platform === "win32" ? process.env.APPDATA
        : process.platform === "darwin" ? path.resolve(process.env.HOME, "Library/Application Support")
            : path.resolve(process.env.HOME, ".config"),
    "BetterDiscord/plugins"
) : path.resolve(__dirname, "../dist/bd");

const watchers: Record<string, rollup.RollupWatcher> = {};

// build each input
for (const inputPath of inputPaths) {
    const outputPath = path.resolve(outDir, `${path.basename(inputPath)}.plugin.js`);

    if (args.watch) {
        // watch for changes
        watch(inputPath, outputPath).then(() => console.log(`Watching for changes in "${inputPath}"`));
    } else {
        // build once
        build(inputPath, outputPath);
    }
}
if (args.watch) {
    // keep process alive
    process.stdin.resume();
    process.stdin.on("end", () => {
        for (const watcher of Object.values(watchers)) {
            watcher.close();
        }
    });
}

async function build(inputPath: string, outputPath: string): Promise<void> {
    const meta = await readMeta(inputPath);
    const config = generateRollupConfig(inputPath, outputPath, meta);

    // bundle plugin
    const bundle = await rollup.rollup(config);
    await bundle.write(config.output);
    success(`Built ${meta.name} v${meta.version} to "${outputPath}"`);

    await bundle.close();
}

async function watch(inputPath: string, outputPath: string): Promise<void> {
    const meta = await readMeta(inputPath);
    const {plugins, ...config} = generateRollupConfig(inputPath, outputPath, meta);
    const metaPath = resolvePluginConfig(inputPath);

    // start watching
    const watcher = rollup.watch({
        ...config,
        plugins: [
            plugins,
            {
                name: "config-watcher",
                buildStart() {
                    this.addWatchFile(metaPath);
                }
            }
        ]
    });

    // close finished bundles
    watcher.on("event", (event) => {
        if (event.code === "BUNDLE_END") {
            success(`Built ${meta.name} v${meta.version} to "${outputPath}" [${event.duration}ms]`);
            event.result.close();
        }
    });

    // restart on config changes
    watcher.on("change", (file) => {
        // check for config changes
        if (file === metaPath) {
            watchers[inputPath].close();
            watch(inputPath, outputPath);
        }

        console.log(`=> Changed "${file}"`);
    });

    watchers[inputPath] = watcher;
}

function resolvePluginConfig(inputPath: string): string {
    return path.resolve(inputPath, "config.json");
}

async function readMeta(inputPath: string): Promise<Meta> {
    const meta = JSON.parse(await fs.readFile(resolvePluginConfig(inputPath), "utf8")) as Meta;
    return {
        ...meta,
        authorLink: meta.authorLink ?? `https://github.com/${meta.author}`,
        website: meta.website ?? `https://github.com/${repo}`,
        source: meta.source ?? `https://github.com/${repo}/tree/master/src/${path.basename(inputPath)}`
    };
}

function buildMeta(meta: Meta): string {
    let result = "/**";
    for (const [key, value] of Object.entries(meta)) {
        result += `\n * @${key} ${value.replace(/\n/g, "\\n")}`;
    }
    return result + "\n**/\n";
}

interface RollupConfig extends Omit<rollup.RollupOptions, "output"> {
    output: rollup.OutputOptions;
}

function generateRollupConfig(inputPath: string, outputPath: string, meta: Meta): RollupConfig {
    const {output, plugins, ...rest} = rollupConfig;

    return {
        ...rest,
        input: path.resolve(inputPath, "index.tsx"),
        plugins: [
            plugins,
            styleModules({
                modules: {
                    generateScopedName: `[local]-${meta.name}`
                },
                cleanup: true
            })
        ],
        output: {
            ...output,
            file: outputPath,
            banner: buildMeta(meta) + `\n/*@cc_on @if (@_jscript)\n${wscript}\n@else @*/\n`,
            footer: "\n/*@end @*/"
        }
    };
}
