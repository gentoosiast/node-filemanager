import { getUsernameFromArgs } from "./utils.js";

const USERNAME = getUsernameFromArgs();

export const sayHi = () => {
  console.log(`Welcome to the File Manager, ${USERNAME}!`);
};

export const sayBye = () => {
  console.log(`Thank you for using File Manager, ${USERNAME}, goodbye!`);
};
