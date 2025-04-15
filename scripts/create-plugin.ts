import minimist from "minimist";
import path from "path";
import fs from 'fs';

import { Logger, createMinimistBooleanArgs, hasMinimistBooleanArg, killIfTrue } from '../packages/danho-lib/src/Utils/Script'

import { StringUtils } from "@utils/String";
import { Arrayable } from "@utils/types";

type ValidFiles = {
  index: Arrayable<string>;
  styles: Arrayable<string> | (() => {
    index: ValidFiles['index'];
  });
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

  actions: () => {
    index: ValidFiles['index'];
    template: Arrayable<string>;
  },
  components: () => {
    index: ValidFiles['index'];
  },
  hooks: () => {
    index: ValidFiles['index'];
  },
  patches: () => {
    index: ValidFiles['index'];
  };
  stores: () => {
    index: ValidFiles['index'];
    template: Arrayable<string>;
  };
  utils: () => {}
  
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
      if (err) Logger.error(`Error writing file ${path}: ${err}`);
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
    ...createMinimistBooleanArgs('action', 'actions'),
    ...createMinimistBooleanArgs('component', 'components'),
    ...createMinimistBooleanArgs('hook', 'hooks'),
    ...createMinimistBooleanArgs('patch', 'patches'),
    ...createMinimistBooleanArgs('setting', 'settings'),
    ...createMinimistBooleanArgs('store', 'stores'),
    ...createMinimistBooleanArgs('style', 'styles'),
    ...createMinimistBooleanArgs('util', 'utils'),
  ]
});

const addByDefault = true;
const addActions = addByDefault || hasMinimistBooleanArg(minimistArgs, 'action', 'actions');
const addComponents = addByDefault || hasMinimistBooleanArg(minimistArgs, 'component', 'components');
const addHooks = addByDefault || hasMinimistBooleanArg(minimistArgs, 'hook', 'hooks');
const addPatches = addByDefault || hasMinimistBooleanArg(minimistArgs, 'patch', 'patches');
const addSettings = addByDefault || hasMinimistBooleanArg(minimistArgs, 'setting', 'settings');
const addStores = addByDefault || hasMinimistBooleanArg(minimistArgs, 'store', 'stores');
const addStyle = addByDefault || hasMinimistBooleanArg(minimistArgs, 'style', 'styles');
const addUtils = addByDefault || hasMinimistBooleanArg(minimistArgs, 'util', 'utils');

const pluginFolder = path.resolve(sourceFolder, pluginName);
fs.mkdirSync(pluginFolder, { recursive: true });

try {
  writeFiles(pluginFolder, {
    actions: addActions ? () => ({
      index: [
        `import { Logger } from "@injections";`,
        '',
        `export default function subscribeToActions() {`,
        `\tLogger.warn('Actions are not being registered yet');`,
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
    components: addComponents ? () => ({
      index: [
        `import { Logger } from "@injections";`,
        `Logger.warn('Components are not being registered yet');`,
      ]
    }) : undefined,
    hooks: addHooks ? () => ({
      index: [
        `import { Logger } from "@injections";`,
        `Logger.warn('Hooks are not being registered yet');`,
      ]
    }) : undefined,
    patches: addPatches ? () => ({
      index: [
        `import { Logger } from "@injections";`,
        '',
        `export default function patch() {`,
        `\tLogger.warn('Patches are not being registered yet');`,
        `}`,
      ],
    }) : undefined,
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
          `import React from "@react";`,
          `import { Setting } from "@components";`,
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
    stores: addStores ? () => ({
      index: [
        `export * from './TemplateStore';`,
        '',
        `import { Settings } from '../settings/Settings';`,
        `import TemplateStore from './TemplateStore';`,
        '',
        `export default function loadStores() {`,
        `\tif (!Settings.current) return;`,
        '\t',
        `\tTemplateStore.load();`,
        `}`,
      ],
      template: [
        `import { DanhoStores, DiumStore } from "@stores";`,
        '',
        'type State = {',
        '\t',
        '};',
        '',
        'export const TemplateStore = new class TemplateStore extends DiumStore<State> {',
        '\tconstructor() {',
        '\t\tsuper({}, \'TemplateStore\');',
        '\t}',
        '\t',
        '\t',
        '}',
        '',
        'DanhoStores.registerStore(TemplateStore);',
        '',
        'export default TemplateStore;',
      ],
    }) : undefined,
    // styles: addStyle ? [
    //   `@use '../../packages/danho-lib/src/styles/utils.scss' as *;`,
    //   ...(addSettings ? [
    //     `@forward '../../packages/danho-lib/src/styles/PluginSettings.scss';`,
    //     `@forward '../../packages/danho-lib/src/styles/Form.scss';`
    //   ] : []),
    // ] : undefined,
    styles: addStyle ? () => ({
      index: [
        `@use '../../../packages/danho-lib/src/styles/utils.scss' as *;`,
        ...(addSettings ? [
          `@forward '../../../packages/danho-lib/src/styles/PluginSettings.scss';`,
          `@forward '../../../packages/danho-lib/src/styles/Form.scss';`
        ] : []),
      ]
    }) : undefined,
    utils: addUtils ? () => ({}) : undefined,

    index: [
      `import { createPlugin } from "@dium";`,
      addActions ? `import { ActionsEmitter } from '@actions';` : undefined,
      '',
      addActions ? `import subscribeToActions from "./actions";` : undefined,
      addPatches ? `import patch from "./patches";` : undefined,
      addSettings ? `import { Settings, SettingsPanel } from "./settings";` : undefined,
      addStores ? `import loadStores from "./stores";` : undefined,
      addStyle ? `import styles from './styles.scss';` : undefined,
      ``,
      `export default createPlugin({`,
      `\tstart() {`,
      addActions || addPatches || addStores ? undefined : '\t\t',
      addActions ? '\t\tsubscribeToActions();' : undefined,
      addPatches ? '\t\tpatch();' : undefined,
      addStores ? '\t\tloadStores();' : undefined,
      `\t},`,
      ...(addActions ? [
        '\t',
        `\tstop() {`,
        `\t\tActionsEmitter.removeAllListeners();`, 
        `\t},`
      ] : []),
      addStyle || addSettings ? '\t' : undefined,
      addStyle ? '\tstyles,' : undefined,
      addSettings ? '\tSettings,' : undefined,
      addSettings ? '\tSettingsPanel,' : undefined,
      `});`
    ],
    package: {
      name: StringUtils.kebabCaseFromPascalCase(pluginName),
      version: "1.0.0",
      author: 'danhosaur',
      description: `Can you guess what ${pluginName} does? Danho didn't put a proper description, so we will both have to guess...`
    },
  });
} catch (err) {
  killIfTrue(true, `Error creating plugin folder: ${err}`);
}

Logger.success(`Plugin "${pluginName}" created successfully! - ${path.resolve(pluginFolder, 'index.tsx')}`);