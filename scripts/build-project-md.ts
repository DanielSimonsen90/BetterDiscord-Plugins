import path from 'path';
import fs from 'fs';
import { Logger, ProjectInfo } from '../packages/danho-lib/src/Utils/Script';
import { DanhoMeta } from '../packages/danho-lib/src/Injections/meta';

const packagePath = path.resolve(__dirname, "../package.json");
const projectPackage = JSON.parse(fs.readFileSync(packagePath, 'utf-8')) as ProjectInfo;

const sourceFolder = path.resolve(__dirname, "../src");
const readmePath = path.resolve(sourceFolder, "README.md");

// Find .gitignore
const gitignorePath = path.resolve(__dirname, "../.gitignore");
const gitignore = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf-8') : "";

// Collect those plugins ignored in .gitignore
const ignoredPlugins = gitignore.replaceAll('\r', '')
  .split('\n')
  .filter(line => line.match(/^src\/(\w+)$/g))
  .map(line => line.split('/')[1])

// Collect all plugins from src, exclude ignored ones
const plugins = fs.readdirSync(sourceFolder, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && !ignoredPlugins.includes(entry.name))
  .map(entry => entry.name);

// Collect package.json from each plugin, map into compiled string with information as name, version & description
const md = plugins.reduce((acc, plugin) => {
  const packagePath = path.resolve(sourceFolder, plugin, "package.json");
  if (!fs.existsSync(packagePath)) {
    Logger.warn(`No package.json found for plugin ${plugin}`);
    return acc;
  }

  const meta = JSON.parse(fs.readFileSync(packagePath, 'utf-8')) as DanhoMeta;

  const md = [
    (projectPackage
      ? `## [${plugin} v${meta.version}](${projectPackage.repository}/dist/bd/${plugin})`
      : `## ${plugin} v${meta.version}`),
    '',
    meta.description,
    '',
    '<br>',
    '',
  ].join('\n');

  acc.push(md);
  return acc;
}, new Array<string>()).join('\n')

fs.writeFileSync(readmePath, [
  `# BetterDiscord Plugins`,
  `Forked from [Zerthox/BetterDiscord-Plugins](https://github.com/Zerthox/BetterDiscord-Plugins)`,
  '',
  md,
  '<br>',
  '',
  '---',
  '',
  '<br>',
  '',
  `## Building from source`,
  '```sh',
  `# install dependencies`,
  `npm install`,
  '',
  `# build all plugins`,
  `npm run build`,
  '',
  `# build specific plugins`,
  `npm run build -- BetterFolders BetterVolume`,
  '',
  `# build plugin to BetterDiscord folder & watch for changes`,
  `npm run dev -- BetterFolders`,
  '```',
  '',
  `## Developer notes`,
  `DevilBro has been so kind to make an enitre list of [Discord Modules](https://github.com/mwittrien/BetterDiscordAddons/blob/b6d959f98ce429d97c68c58fba29392bd25ff6f5/Library/_res/0BDFDB.data.json#L394)`,
].join('\n'), 'utf-8');

Logger.success(`README.md generated with ${plugins.length} plugins - ${readmePath}`);