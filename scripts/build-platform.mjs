import { spawnSync } from "node:child_process";

const isVercel = process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
const command = isVercel ? ["npm", ["run", "build:vercel"]] : ["npm", ["run", "build:sites"]];
const result = spawnSync(command[0], command[1], {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
