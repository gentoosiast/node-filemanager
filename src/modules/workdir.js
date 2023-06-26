import { homedir, EOL } from "node:os";

export const printWorkingDirectory = () => {
  console.log(`${EOL}You are currently in ${process.cwd()}`);
};

export const setStartingWorkingDirectory = () => {
  process.chdir(homedir());
};
