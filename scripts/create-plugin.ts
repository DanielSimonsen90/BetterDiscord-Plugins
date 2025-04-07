import chalk from "chalk";
import minimist from "minimist";
import path from "path";
import fs from 'fs';

import { StringUtils } from "../packages/danho-lib/src/Utils/String";
import { Arrayable } from "../packages/danho-lib/src/Utils/types";

const success = (msg: string) => console.log(chalk.green(msg));
const warn = (msg: string) => console.warn(chalk.yellow(`Warn: ${msg}`));
const error = (msg: string) => console.error(chalk.red(`Error: ${msg}`));
const killIfTrue = (condition: boolean, msg: string) => {
  if (condition) {
    error(msg);
    process.exit(1);
  }
};
const createMinimistBooleanArgs = (key: string, keyPlural: string) => [
  `with${key.charAt(0).toUpperCase() + key.slice(1)}`,
  `with-${key}`,
  key
].concat([
  `with${keyPlural.charAt(0).toUpperCase() + keyPlural.slice(1)}`,
  `with-${keyPlural}`,
  keyPlural
])
const hasMinimistBooleanArg = (args: minimist.ParsedArgs, key: string, keyPlural: string) => {
  return createMinimistBooleanArgs(key, keyPlural).some(arg => args[arg]);
};

type ValidFiles = {
  index: Arrayable<string>;
  style: Arrayable<string>;
  package: Record<string, any>;
  readme: Arrayable<string>;
  settings: Arrayable<string> | (() => {
    index: ValidFiles['index'];
    Settings: Arrayable<string>;
    SettingsPanel: Arrayable<string> | (() => {
      index: ValidFiles['index'];
      SettingsPanel: Arrayable<string>;
    }),
  }),
  patches: () => {
    index: ValidFiles['index'];
  };
  actions: () => {
    index: ValidFiles['index'];
    template: Arrayable<string>;
  }
}

function writeFiles(directoryPath: string, files: Partial<ValidFiles>) {
  Object.entries(files).forEach(([fileName, content]) => {
    const fileContent = (() => {
      if (typeof content === 'string') return content;
      if (typeof content === 'function') {
        const folderPath = path.resolve(directoryPath, fileName);
        fs.mkdirSync(folderPath, { recursive: true });
        writeFiles(folderPath, content());
        return undefined;
      }
      if (Array.isArray(content)) return content.filter(line => line !== undefined).join('\n');
      if (typeof content === 'object') return JSON.stringify(content, null, 2);
      return content;
    })();

    const fileNameWithExtension = (() => {
      switch (fileName) {
        case 'style': return 'style.scss';
        // case 'index': return 'index.tsx';
        case 'package': return 'package.json';
        case 'readme': return 'README.md';
        default: return `${fileName}.tsx`;
      }
    })();

    if (!fileContent) return;

    fs.writeFile(path.resolve(directoryPath, fileNameWithExtension), fileContent, { encoding: 'utf-8' }, (err) => {
      if (err) error(`Error writing file ${path}: ${err}`);
    });
  });
}

// find sources
const sourceFolder = path.resolve(__dirname, "../src");
const args = process.argv.slice(2);

let pluginName = args.shift() || prompt("Plugin name: ");
killIfTrue(!pluginName, "No plugin name provided");
killIfTrue(fs.existsSync(path.resolve(sourceFolder, pluginName)), `Plugin "${pluginName}" already exists`);

const minimistArgs = minimist(args, {
  boolean: [
    ...createMinimistBooleanArgs('style', 'styles'),
    ...createMinimistBooleanArgs('setting', 'settings'),
    ...createMinimistBooleanArgs('patch', 'patches'),
    ...createMinimistBooleanArgs('action', 'actions'),
  ]
});

const addStyle = hasMinimistBooleanArg(minimistArgs, 'style', 'styles');
const addSettings = hasMinimistBooleanArg(minimistArgs, 'setting', 'settings');
const addPatches = hasMinimistBooleanArg(minimistArgs, 'patch', 'patches');
const addActions = hasMinimistBooleanArg(minimistArgs, 'action', 'actions');

const pluginFolder = path.resolve(sourceFolder, pluginName);
fs.mkdirSync(pluginFolder, { recursive: true });

try {
  writeFiles(pluginFolder, {
    index: [
      `import { createPlugin } from "@dium";`,
      addActions ? `import { ActionsEmitter } from '@actions';` : undefined,
      '',
      addActions ? `import subscribeToActions from "./actions";` : undefined,
      addPatches ? `import patch from "./patches";` : undefined,
      addSettings ? `import { Settings, SettingsPanel } from "./settings";` : undefined,
      addStyle ? `import styles from './style.scss';` : undefined,
      ``,
      `export default createPlugin({`,
      `\tstart() {`,
      addActions ? '\t\tsubscribeToActions();' : undefined,
      addPatches ? '\t\tpatch();' : '\t',
      `\t},`,
      ...(addActions ? [
        '\t',
        `\tstop() {`,
        `\t\tActionsEmitter.removeAllListeners();`, 
        `\t},`
      ] : []),
      addStyle || addSettings || addActions ? '  ' : undefined,
      addStyle ? '\tstyles,' : undefined,
      addSettings ? '\tSettings,' : undefined,
      addSettings ? '\tSettingsPanel,' : undefined,
      `});`
    ],
    style: addStyle ? [
      `@use '../../packages/danho-lib/src/styles/utils.scss' as *;`,
      ...(addSettings ? [
        `@forward '../../packages/danho-lib/src/styles/PluginSettings.scss';`,
        `@forward '../../packages/danho-lib/src/styles/Form.scss';`
      ] : []),
    ] : undefined,
    package: {
      name: StringUtils.kebabCaseFromPascalCase(pluginName),
      version: "1.0.0",
      author: 'danhosaur',
      description: `Can you guess what ${pluginName} does? Danho didn't put a proper description, so we will both have to guess...`
    },
    settings: addSettings ? () => ({
      index: [
        `export * from './Settings';`,
        `export { default as SettingsPanel } from './SettingsPanel';`,
      ],
      Settings: [
        `import { createSettings } from "@dium/settings";`,
        '',
        `export const Settings = createSettings({`,
        `\t// TODO`,
        `})`,
        '',
        `export const titles: Record<keyof typeof Settings.current, string> = {`,
        `\t// TODO`,
        `}`,
      ],
      SettingsPanel: () => ({
        index: 'export { default } from "./SettingsPanel";',
        SettingsPanel: [
          `import React, { Setting } from "@react";`,
          `import { Settings, titles } from "../Settings";`,
          '',
          `export default function SettingsPanel() {`,
          `\tconst [settings, set] = Settings.useState();`,
          `\tconst props = {`,
          `\t\tsettings,`,
          `\t\tset,`,
          `\t\ttitles,`,
          `\t}`,
          `\t`,
          `\treturn (`,
          `\t\t<div className="danho-plugin-settings">`,
          `\t\t\t{/* TODO */}`,
          `\t\t</div>`,
          `\t);`,
          `}`,
        ]
      })
    }) : undefined,
    patches: addPatches ? () => ({
      index: [
        `export default function patch() {`,
        `\t// TODO`,
        `}`,
      ]
    }) : undefined,
    actions: addActions ? () => ({
      index: [
        `export default function subscribeToActions() {`,
        `\t// TODO`,
        `}`,
      ],
      template: [
        `import { ActionsEmitter } from "@actions";`,
        '',
        `export default function onTemplate() {`,
        `\tActionsEmitter.on('template', ({  }) => {`,
        `\t\t// TODO`,
        `\t});`,
        `}`,
      ]
    }) : undefined,
  });
} catch (err) {
  killIfTrue(true, `Error creating plugin folder: ${err}`);
}

success(`Plugin "${pluginName}" created successfully! - ${path.resolve(pluginFolder, 'index.tsx')}`);