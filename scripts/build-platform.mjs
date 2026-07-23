import { spawnSync } from "node:child_process";

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const isWindows = process.platform === "win32";

const command = isVercel || isWindows
  ? (isWindows ? "npx.cmd" : "npx")
  : "bash";
const args = isVercel || isWindows
  ? ["--no-install", "next", "build"]
  : ["scripts/build-verified.sh"];

const result = spawnSync(command, args, {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
