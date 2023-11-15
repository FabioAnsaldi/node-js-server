"use strict";
const http = require('http');
const lib = require('./lib');
const hostname = process.env.SERVER_ADDRESS || '127.0.0.1';
const index = process.env.SERVER_INDEX || '';
const port = process.env.SERVER_PORT || 4321;
const source = process.env.SERVER_SOURCE || '';
const verbose = (process.env.SERVER_VERBOSE && process.env.SERVER_VERBOSE === 'true') || false;
const server = http.createServer((req, res) => {
    let fileName = '';
    if (req.url === '/') {
        fileName = index;
    }
    let filePath = lib.buildPath('.', source, req.url, fileName);
    if (verbose) {
        console.info(`\Searching filePath: ${filePath}`);
    }
    lib.getContentFile({ path: filePath, base: lib.buildPath('.', source) })
        .then((response) => {
        if (verbose) {
            console.info(`\Getting content: ${response.content.slice(0, 50)}`);
        }
        res.statusCode = response.statusCode;
        res.setHeader('Content-Type', response.contentType);
        res.end(response.content);
    }).catch((response) => {
        if (verbose) {
            console.info(`\Getting error: ${response.error}`);
        }
        res.statusCode = response.statusCode;
        res.setHeader('Content-Type', response.contentType);
        res.end(`Ops!<br /><br />${response.error}`);
    });
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
