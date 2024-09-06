import { Plugin } from "rollup";
import fs from "fs";
import path from "path";

export default function addMetaCode(inputPath?: string, expectedFileName = 'package.json'): Plugin {
  const metaFile = fs.readFileSync(path.resolve(inputPath, expectedFileName), "utf-8");
  const meta = metaFile ? JSON.stringify(JSON.parse(metaFile), null, 2) : undefined;
  if (!meta) console.error(`No ${expectedFileName} found in ${inputPath}`);

  return {
    name: 'ensure-meta-set',
    banner: `let meta = ${meta};`
  }
}