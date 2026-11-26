'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);
const port = Number(process.env.PORT || 8000);
const host = process.env.HOST || '127.0.0.1';

const mimeTypes = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webm': 'video/webm',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8'
};

const routeAliases = {
  'about': 'about-us',
  'projects': 'work',
  'project': 'work'
};

const blockedPrefixes = ['backend/', '.github/', '.vscode/'];

function respondText(res, status, message) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(message);
}

function respondNotFound(req, res) {
  const notFoundFile = path.join(root, '404.html');
  const accept = req.headers.accept || '';
  if (fs.existsSync(notFoundFile) && (accept.includes('text/html') || !path.extname(req.url.split('?')[0]))) {
    res.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Content-Type-Options': 'nosniff'
    });
    if (req.method === 'HEAD') return res.end();
    return fs.createReadStream(notFoundFile).pipe(res);
  }
  return respondText(res, 404, 'Not found');
}

function resolveFile(relativePath) {
  const normalized = relativePath.replace(/\/+$/, '');
  const mapped = routeAliases[normalized] || normalized;
  const candidate = path.resolve(root, mapped || 'index.html');
  const rootPrefix = root.endsWith(path.sep) ? root : root + path.sep;

  if (candidate !== root && !candidate.startsWith(rootPrefix)) {
    return { status: 403 };
  }

  const relCheck = path.relative(root, candidate).replace(/\\/g, '/');
  if (blockedPrefixes.some((prefix) => relCheck === prefix.slice(0, -1) || relCheck.startsWith(prefix))) {
    return { status: 404 };
  }

  if (fs.existsSync(candidate)) {
    const stat = fs.statSync(candidate);
    if (stat.isFile()) return { status: 200, filePath: candidate, stat };
    if (stat.isDirectory()) {
      const idx = path.join(candidate, 'index.html');
      if (fs.existsSync(idx) && fs.statSync(idx).isFile()) {
        return { status: 200, filePath: idx, stat: fs.statSync(idx) };
      }
    }
  }

  if (!path.extname(candidate)) {
    const htmlCandidate = candidate + '.html';
    if (fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) {
      return { status: 200, filePath: htmlCandidate, stat: fs.statSync(htmlCandidate) };
    }
  }

  return { status: 404 };
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return respondText(res, 405, 'Method not allowed');
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (error) {
    return respondText(res, 400, 'Invalid request path');
  }

  const relativePath = pathname.replace(/^[/\\]+/, '');
  const resolved = resolveFile(relativePath);

  if (resolved.status === 403) {
    return respondText(res, 403, 'Forbidden');
  }
  if (resolved.status !== 200) {
    return respondNotFound(req, res);
  }

  const { filePath, stat } = resolved;
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || (extension ? 'application/octet-stream' : 'text/html; charset=utf-8');
  const isHtml = contentType.startsWith('text/html');
  const cacheControl = isHtml
    ? 'no-cache'
    : (extension === '.mp4' || extension === '.webm' || extension === '.svg' || extension === '.ico'
      ? 'public, max-age=86400'
      : 'public, max-age=3600');

  const commonHeaders = {
    'Content-Type': contentType,
    'Cache-Control': cacheControl,
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff'
  };

  if (extension === '.mp4' || extension === '.webm') {
    commonHeaders['Accept-Ranges'] = 'bytes';
    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (match) {
        const start = match[1] ? parseInt(match[1], 10) : 0;
        const end = match[2] ? Math.min(parseInt(match[2], 10), stat.size - 1) : stat.size - 1;
        if (start >= stat.size || start > end) {
          res.writeHead(416, { 'Content-Range': 'bytes */' + stat.size });
          return res.end();
        }
        res.writeHead(206, Object.assign({}, commonHeaders, {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Content-Length': end - start + 1
        }));
        if (req.method === 'HEAD') return res.end();
        return fs.createReadStream(filePath, { start, end }).pipe(res);
      }
    }
  }

  commonHeaders['Content-Length'] = stat.size;
  res.writeHead(200, commonHeaders);
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log('Portfolio frontend available at http://' + host + ':' + port);
});
