import { homedir } from "node:os";

export const printWorkingDirectory = () => {
  console.log(`You are currently in ${process.cwd()}`);
};

export const setStartingWorkingDirectory = () => {
  process.chdir(homedir());
};
