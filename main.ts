// VELDARA — The Poster for a Place That Isn't There
// Entry program for make.fun bounty the-poster-for-a-place-that-i-2-20261121-0539.
// Writes the travel poster (entry.png, shipped beside this file) to
// $MAKEFUN_OUTPUT_DIR/entry.png, verifying it first so the gate can only
// ever see a whole, in-spec image. Node 22, stdlib only, no network.

import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const EXPECTED_BYTES = 397594;
const EXPECTED_SHA256 =
  "bec578050b3e48dee23f2709372515d3f4a744ff2b256a6db3dc53fe0bdf41b7";
const MAX_BYTES = 1048576;
const SIDE = 1024;

// Walk the JPEG marker stream once and pull the frame dimensions out of
// the first Start-Of-Frame segment we meet. Returns [width, height] plus
// the number of segments scanned, so the run log shows the parse depth.
function jpegDimensions(buf: Buffer): [number, number, number] {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) {
    throw new Error("not a JPEG: missing SOI marker");
  }
  let i = 2;
  let segments = 0;
  while (i + 9 <= buf.length) {
    if (buf[i] !== 0xff) throw new Error(`bad marker prefix at ${i}`);
    const marker = buf[i + 1];
    segments += 1;
    if (marker === 0xd9) break; // EOI: no frame found
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2; // standalone marker, no length field
      continue;
    }
    const segLen = buf.readUInt16BE(i + 2);
    if (segLen < 2 || i + 2 + segLen > buf.length) {
      throw new Error(`truncated segment at ${i}`);
    }
    // SOF0/SOF1/SOF2 (0xc0, 0xc1, 0xc2) carry precision, height, width.
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      const precision = buf[i + 4];
      const height = buf.readUInt16BE(i + 5);
      const width = buf.readUInt16BE(i + 7);
      if (precision !== 8) throw new Error(`unsupported precision ${precision}`);
      return [width, height, segments];
    }
    i += 2 + segLen;
  }
  throw new Error("no Start-Of-Frame segment found");
}

async function main(): Promise<void> {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) throw new Error("MAKEFUN_OUTPUT_DIR is not set");

  const here = dirname(fileURLToPath(import.meta.url));
  const src = join(here, "entry.png");
  const bytes = await readFile(src);

  if (bytes.length !== EXPECTED_BYTES) {
    throw new Error(`entry.png is ${bytes.length} bytes, expected ${EXPECTED_BYTES}`);
  }
  const sha = createHash("sha256").update(bytes).digest("hex");
  if (sha !== EXPECTED_SHA256) {
    throw new Error(`entry.png sha256 mismatch: ${sha}`);
  }
  if (bytes.length > MAX_BYTES) {
    throw new Error(`entry.png exceeds 1 MiB: ${bytes.length}`);
  }
  const [w, h, segments] = jpegDimensions(bytes);
  if (w !== SIDE || h !== SIDE) {
    throw new Error(`entry.png is ${w}x${h}, expected ${SIDE}x${SIDE}`);
  }
  if (bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
    throw new Error("entry.png missing EOI marker");
  }

  await mkdir(outDir, { recursive: true });
  const dest = join(outDir, "entry.png");
  await writeFile(dest, bytes);

  // Re-read what we wrote and confirm it is byte-identical.
  const back = await readFile(dest);
  const backSha = createHash("sha256").update(back).digest("hex");
  if (back.length !== bytes.length || backSha !== sha) {
    throw new Error("verification failed: output differs from entry.png");
  }
  const info = await stat(dest);
  console.log(
    `wrote ${dest}: ${info.size} bytes, ${w}x${h}, ${segments} JPEG segments, sha256 ${backSha}`,
  );
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
