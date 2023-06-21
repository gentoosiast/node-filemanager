import { sayHi, sayBye } from "./modules/greet.js";

console.clear();
sayHi();

process.on("exit", sayBye);
