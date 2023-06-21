import readlinePromises from "node:readline/promises";
import { printWorkingDirectory } from "./workdir.js";
import { parseCommand } from "./parser.js";

export const startCLI = () => {
  const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.prompt();
  rl.on("line", async (line) => {
    await parseCommand(line);
    printWorkingDirectory();
    rl.prompt();
  });
};
