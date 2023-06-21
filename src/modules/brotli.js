import fsPromises from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";

export const processFileWithBrotli = async (
  srcFilePath,
  destFilePath,
  operation = "compress"
) => {
  let srcFh = null;
  let destFh = null;

  try {
    srcFh = await fsPromises.open(srcFilePath);
    destFh = await fsPromises.open(destFilePath, "w");

    const readStream = srcFh.createReadStream();
    const writeStream = destFh.createWriteStream();
    const brotliProcessor =
      operation === "compress"
        ? createBrotliCompress()
        : createBrotliDecompress();

    await pipeline(readStream, brotliProcessor, writeStream);
  } catch (err) {
    srcFh?.close();
    destFh?.close();
    throw err;
  }
};
