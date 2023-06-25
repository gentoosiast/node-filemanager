import { EOL } from "node:os";
import readline from "node:readline";
import { printWorkingDirectory } from "./workdir.js";
import { dispatchCommand } from "./cmd-dispatcher.js";
import { handleInvalidOperation } from "./utils.js";

export const startCLI = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.prompt();
  rl.on("line", async (line) => {
    try {
      await dispatchCommand(line);
    } catch {
      handleInvalidOperation();
    }
    printWorkingDirectory();
    rl.prompt();
  });
  rl.on("close", () => console.log(EOL));
};
