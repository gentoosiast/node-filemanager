import { sayHi, sayBye } from "./modules/greet.js";
import { setStartingWorkingDirectory } from "./modules/workdir.js";
import { startCLI } from "./modules/readline.js";

setStartingWorkingDirectory();
console.clear();
sayHi();
startCLI();

process.on("exit", sayBye);
