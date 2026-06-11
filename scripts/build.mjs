import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const node = process.execPath;

run(node, ["node_modules/prisma/build/index.js", "generate"]);

if (process.env.VERCEL === "1") {
  run(node, ["node_modules/prisma/build/index.js", "migrate", "deploy"]);
}

run(node, ["node_modules/next/dist/bin/next", "build"]);
