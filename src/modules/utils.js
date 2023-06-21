const DEFAULT_USERNAME = "anonymous";

export const getUsernameFromArgs = () => {
  const usernameArg = process.argv.find((arg) => arg.startsWith("--username="));

  if (!usernameArg) {
    return DEFAULT_USERNAME;
  }

  return usernameArg.split("=")[1] || DEFAULT_USERNAME;
};
