import path from "node:path";
import url from "node:url";

export function getFile(name: string) {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  return path.join(__dirname, name);
}
