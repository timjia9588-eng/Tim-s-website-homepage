import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
try { await stat(resolve(root, 'index.html')); }
catch { console.error('Missing dist/index.html. Run npm install and npm run build first.'); process.exit(1); }

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  let file;
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    if (!(await stat(file)).isFile()) throw new Error('Not a file');
  } catch { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  if (request.method === 'HEAD') { response.end(); return; }
  const stream = createReadStream(file);
  stream.on('error', () => response.destroy());
  stream.pipe(response);
});

let port = Number(process.env.PORT) || 4174;
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE' && port < 4190) server.listen(++port, '127.0.0.1');
  else { console.error(error.message); process.exit(1); }
});
server.on('listening', () => console.log(`\nTim Jia portfolio preview: http://127.0.0.1:${port}/\nKeep this window open. Press Ctrl+C to stop.\n`));
server.listen(port, '127.0.0.1');
