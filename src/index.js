import { sayHi, sayBye } from "./modules/greet.js";
import {
  setStartingWorkingDirectory,
  printWorkingDirectory,
} from "./modules/workdir.js";

console.clear();
sayHi();

setStartingWorkingDirectory();
printWorkingDirectory();

process.on("exit", sayBye);
