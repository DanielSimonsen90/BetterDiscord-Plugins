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
const createMinimistBooleanArgs = (key: string) => [
  `with${key.charAt(0).toUpperCase() + key.slice(1)}`,
  `with-${key}`,
  key
];
const hasMinimistBooleanArg = (args: minimist.ParsedArgs, key: string) => {
  return createMinimistBooleanArgs(key).some(arg => args[arg]);
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
    ...createMinimistBooleanArgs('style'),
    ...createMinimistBooleanArgs('settings'),
    ...createMinimistBooleanArgs('patches')
  ]
});

const addStyle = hasMinimistBooleanArg(minimistArgs, 'style');
const addSettings = hasMinimistBooleanArg(minimistArgs, 'settings');
const addPatches = hasMinimistBooleanArg(minimistArgs, 'patches');

const pluginFolder = path.resolve(sourceFolder, pluginName);
fs.mkdirSync(pluginFolder, { recursive: true });

try {
  writeFiles(pluginFolder, {
    index: [
      `import { createPlugin } from "@dium";`,
      addPatches ? `import patch from "./patches";` : '',
      addStyle ? `import styles from './style.scss';` : '',
      addSettings ? `import { Settings, SettingsPanel } from "./Settings";` : undefined,
      ``,
      `export default createPlugin({`,
      `  start() {`,
      addPatches ? '  patch();' : undefined,
      `  },`,
      ``,
      addStyle ? '  styles,' : undefined,
      addSettings ? '  Settings,' : undefined,
      addSettings ? '  SettingsPanel,' : undefined,
      `});`
    ],
    style: addStyle ? '' : undefined,
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
        `  // TODO`,
        `})`,
        '',
        `export const titles: Record<keyof typeof Settings.current, string> = {`,
        `  // TODO`,
        `}`,
      ],
      SettingsPanel: () => ({
        index: 'export { default } from "./SettingsPanel";',
        SettingsPanel: [
          `import React, { Setting } from "@react";`,
          `import { Settings, titles } from "../Settings";`,
          '',
          `export default function SettingsPanel() {`,
          `  const [settings, set] = Settings.useState();`,
          `  const props = {`,
          `    settings,`,
          `    set,`,
          `    titles,`,
          `  }`,
          ``,
          `  // TODO`,
          `  `,
          `  return (`,
          `    <div className="danho-plugin-settings">`,
          `      <FormSection title="{getMeta().name}">`,
          `        {/* TODO */}`,
          `      </FormSection>`,
          `    </div>`,
          `  );`,
          `}`,
        ]
      })
    }) : undefined,
    patches: addPatches ? () => ({
      index: [
        `export default function patch() {`,
        `  // TODO`,
        `}`,
      ]
    }) : undefined,
  });
} catch (err) {
  killIfTrue(true, `Error creating plugin folder: ${err}`);
}

success(`Plugin "${pluginName}" created successfully! - ${path.resolve(pluginFolder, 'index.tsx')}`);