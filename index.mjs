import {readFileSync} from "node:fs";
import {pathToFileURL} from "node:url";

export function run(input) {
  const {before, after} = input;
  const changes = [];
  for (const key of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()) {
    if (!Object.hasOwn(before, key)) changes.push({key, kind:"added"});
    else if (!Object.hasOwn(after, key)) changes.push({key, kind:"removed"});
    else if (!Object.is(before[key], after[key])) changes.push({key, kind:"updated"});
  }
  return changes;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv.length !== 3) throw new Error("Usage: node index.mjs INPUT.json");
    const input = JSON.parse(readFileSync(process.argv[2], "utf8"));
    console.log(JSON.stringify(run(input), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
