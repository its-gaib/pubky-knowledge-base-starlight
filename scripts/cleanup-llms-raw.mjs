#!/usr/bin/env node

/**
 * Cleans up the raw Claude CLI output (public/llms-raw.txt) into public/llms.txt.
 * Strips any preamble before the first "# " heading and any trailing non-content lines.
 * Exits with error if the output appears empty or malformed.
 */

import { readFileSync, writeFileSync, unlinkSync } from "fs";

const RAW_PATH = "public/llms-raw.txt";
const OUT_PATH = "public/llms.txt";

let raw;
try {
  raw = readFileSync(RAW_PATH, "utf-8");
} catch {
  console.error(`Error: ${RAW_PATH} not found. Claude CLI may have failed.`);
  process.exit(1);
}

const start = raw.indexOf("# ");
if (start === -1) {
  console.error("Error: No '# ' heading found in Claude CLI output. The output may be malformed.");
  console.error("Raw output preview:", raw.slice(0, 200));
  process.exit(1);
}

let content = raw.slice(start);

// Strip trailing separator and anything after it (e.g. permission messages)
const lastSeparator = content.lastIndexOf("\n---");
if (lastSeparator > 0) {
  content = content.slice(0, lastSeparator);
}

content = content.trim() + "\n";

if (content.length < 500) {
  console.error("Error: Generated llms.txt is suspiciously small (%d bytes). Check Claude CLI output.", content.length);
  process.exit(1);
}

writeFileSync(OUT_PATH, content, "utf-8");
unlinkSync(RAW_PATH);
console.log(`Generated ${OUT_PATH} (${(content.length / 1024).toFixed(1)} KB)`);
