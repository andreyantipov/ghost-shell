#!/usr/bin/env bun

import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    watch: { type: "boolean", short: "w" },
    ui: { type: "boolean" },
    coverage: { type: "boolean", short: "c" },
    file: { type: "string", short: "f" },
  },
});

// Build the command
let cmd = ["bun", "test"];

if (values.watch) {
  cmd.push("--watch");
}

if (values.file) {
  cmd.push(values.file);
}

if (values.ui) {
  console.log("⚠️  UI mode is not supported with Bun test runner");
  console.log("📝 Tests will run in watch mode instead");
  cmd.push("--watch");
}

if (values.coverage) {
  console.log("⚠️  Coverage is not yet supported with Bun test runner");
}

// Run the command
console.log(`🚀 Running: ${cmd.join(" ")}`);
const proc = Bun.spawn(cmd, { stdio: ["inherit", "inherit", "inherit"] });
await proc.exited;