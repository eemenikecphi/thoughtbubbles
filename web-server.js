#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');

const PORT = process.env.PORT || 3000;

// Simple static file server for development
const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Default to index.html for SPA routing
  if (pathname === '/' || pathname.endsWith('/')) {
    pathname = '/index.html';
  }

  const filePath = path.join(__dirname, 'web-build', pathname);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Fallback to index.html for SPA routing
      const indexPath = path.join(__dirname, 'web-build', 'index.html');
      fs.readFile(indexPath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 - Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } else {
      // Serve the requested file
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
      };
      
      const contentType = mimeTypes[ext] || 'text/plain';

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 - Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        }
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 MoboRev development server running at:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://0.0.0.0:${PORT}`);
  console.log('');
  console.log('💡 Press Ctrl+C to stop the server');
});

module.exports = server;