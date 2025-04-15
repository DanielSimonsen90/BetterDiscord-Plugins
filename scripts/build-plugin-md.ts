import { Meta } from "@dium";
import path from "path";
import fs from "fs";

import { Logger, ProjectInfo } from '../packages/danho-lib/src/Utils/Script'

const DanhoGithubUsername = "DanielSimonsen90";
const ZerthoxGithubUsername = "Zerthox";

export default function buildMd(inputPath: string, meta: Meta) {
  if (meta.description.includes("Can you guess")) {
    Logger.warn(`Description for ${meta.name} is not configured - ${path.resolve(inputPath, 'package.json')}`);
    return;
  }

  const readme = path.resolve(path.dirname(inputPath), "README.md");
  if (fs.existsSync(readme)) fs.writeFileSync(readme, ``);

  const projectInfoPath = path.resolve(
    path.dirname(inputPath),
    '../../package.json'
  );

  let projectInfo: ProjectInfo | null = null;
  if (!fs.existsSync(projectInfoPath)) Logger.error(`Project info file not found: ${projectInfoPath}`);
  else projectInfo = JSON.parse(fs.readFileSync(projectInfoPath, 'utf-8'));

  const readmeContent = fs.readFileSync(readme, 'utf-8');
  const md = [
    (projectInfo 
      ? `# [${meta.name} v${meta.version}](${projectInfo.repository}/dist/bd/${meta.name})` 
      : `# ${meta.name} v${meta.version}`),
    `by ${meta.author}`,
    '',

    `## What does it do?`,
    `${meta.description}`,
    '',

    ...(projectInfo ? [
      `## Found a bug?`,
      `If you found a bug, please report it [here](${projectInfo?.bugs}) and I will see to it when I can. Make sure you include the following information:`,
      `- Which plugin has the bug`,
      `- A detailed description of the bug including reproduction steps`,
      `- Your plugin settings (if any)`,
      `- A screenshot of the bug (if applicable)`,
      '',
    ] : [] as Array<string>),

    `## License & Credits`,
    `The entire repository is licensed under the [MIT License](https://opensource.org/licenses/MIT), meaning you can do whatever you want with it as long as you include the original license.`,
    '',
    (projectInfo ?
      `This repository is based on [Zerthox's BetterDiscord-Plugins repository](${projectInfo.repository.replaceAll(DanhoGithubUsername, ZerthoxGithubUsername)}) that has then been further modified by me to fit my own needs.` 
      : ''
    )
  ].join('\n');

  if (readmeContent === md) return; // No changes, skip

  fs.writeFileSync(readme, md, 'utf-8');
  Logger.success(`Updated README.md for ${meta.name} v${meta.version} - ${readme}`);
}