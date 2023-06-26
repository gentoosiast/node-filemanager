export const parseLine = (untrimmedLine) => {
  const line = untrimmedLine.trim();
  const args = [];
  let quoteSymbol = null;
  let isInsideQuotes = false;
  let argStart = null;

  let i = 0;
  while (i < line.length) {
    switch (true) {
      case /\s/.test(line[i]): {
        if (argStart !== null && !isInsideQuotes && line[i - 1] !== "\\") {
          args.push(line.substring(argStart, i));
          argStart = null;
        }
        i += 1;
        break;
      }

      case ['"', "'"].includes(line[i]): {
        if (line[i - 1] === "\\") {
          i += 1;
          break;
        }

        if (!isInsideQuotes && argStart !== null) {
          throw new Error(
            "Invalid input: quote in the middle of argument are not allowed"
          );
        }

        if (!isInsideQuotes) {
          quoteSymbol = line[i];
          isInsideQuotes = true;
        } else if (line[i] === quoteSymbol) {
          args.push(line.substring(argStart, i));
          quoteSymbol = null;
          isInsideQuotes = false;
          argStart = null;
        }
        i += 1;
        break;
      }

      default: {
        if (argStart === null) {
          argStart = i;
        }
        i += 1;
        break;
      }
    }
  }

  // push the last argument
  if (argStart !== null) {
    if (isInsideQuotes) {
      throw new Error("Invalid input: quotes were open, but never closed");
    }
    args.push(line.substring(argStart, i));
  }

  return args.map((arg) => arg.replace(/\\([\s'"])/g, "$1")); // remove escapes
};
