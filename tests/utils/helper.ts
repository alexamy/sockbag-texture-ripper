import path from "node:path";
import url from "node:url";

export function resolve(name: string, meta: string) {
  const __dirname = path.dirname(url.fileURLToPath(meta));
  return path.join(__dirname, name);
}
