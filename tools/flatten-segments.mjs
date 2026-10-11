// Runs after `next build` (npm's postbuild). The static export writes each page's prefetch data as
// out/<page>/__next.<page>/__PAGE__.txt, but the browser asks for out/<page>/__next.<page>.__PAGE__.txt, so on a
// plain web server every link prefetch 404s. Copy each such file to the flat name the browser asks for.
import fs from "node:fs";
import path from "node:path";

const out = path.resolve("out");
if (!fs.existsSync(out)) process.exit(0);

let copied = 0;
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (!e.isDirectory()) continue;
    if (e.name.startsWith("__next.")) {
      // every file under it, at <parent>/<dir name>.<path inside, with / as .>
      const flatten = (sub, prefix) => {
        for (const f of fs.readdirSync(sub, { withFileTypes: true })) {
          const q = path.join(sub, f.name);
          if (f.isDirectory()) flatten(q, `${prefix}.${f.name}`);
          else {
            fs.copyFileSync(q, path.join(dir, `${prefix}.${f.name}`));
            copied++;
          }
        }
      };
      flatten(p, e.name);
    } else walk(p);
  }
};
walk(out);
console.log(`flatten-segments: ${copied} prefetch file(s) copied to the names the browser requests`);
