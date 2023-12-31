import fsPromises from "node:fs/promises";
import { createHash } from "node:crypto";

export const calculateHash = async (filePath) => {
  let fh = null;

  try {
    fh = await fsPromises.open(filePath);
    const readStream = fh.createReadStream();
    const hash = createHash("sha256");

    await new Promise((res, rej) => {
      readStream.on("readable", () => {
        const chunk = readStream.read();

        if (chunk) {
          hash.update(chunk);
        } else {
          console.log(hash.digest("hex"));
          res();
        }
      });

      readStream.on("error", (err) => {
        rej(err);
      });
    });
  } finally {
    fh?.close();
  }
};
