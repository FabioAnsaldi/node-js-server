"use strict";
const fs = require('fs');
const util = require('util');
const path = require('path');
const { JSDOM } = require('jsdom');
const buildPath = (...args) => {
    return args.map((part, i) => {
        if (i === 0) {
            return part.trim().replace(/[\/]*$/g, '');
        }
        else {
            return part.trim().replace(/(^[\/]*|[\/]*$)/g, '');
        }
    }).filter(x => x.length).join('/');
};
// Recursive function to get files
const getFiles = (dir, files = [], recursively = false) => {
    // Get an array of all files and directories in the passed directory using fs.readdirSync
    const fileList = fs.readdirSync(dir);
    // Create the full path of the file/directory by concatenating the passed directory and file/directory name
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        // Check if the current file/directory is a directory using fs.statSync
        if (recursively && fs.statSync(name).isDirectory()) {
            // If it is a directory, recursively call the getFiles function with the directory path and the files array
            getFiles(name, files);
        }
        else {
            // If it is a file, push the full path to the files array
            files.push(name);
        }
    }
    return files;
};
const getContentType = (ext) => {
    let contentType = 'text/html';
    switch (ext) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }
    return contentType;
};
const compileContent = (conten, files = [], base) => {
    const doc = new JSDOM(conten);
    const tbody = (doc && doc.window.document.querySelector('tbody'));
    const tr = (doc && doc.window.document.querySelector('tr'));
    // for each file, it will gets the extension ti choose a proper icon image
    files.forEach((file, i) => {
        let icon = 'dir';
        let filename = file.replace(/^.*[\\/]/, '');
        let href = file.replace(base, '');
        let ext = filename.replace('./', '').split('.');
        if (ext[1]) {
            icon = ext[1];
        }
        // if we have only one file, we do not need to clone the HTHML elements and then append to
        if (i === files.length - 1) {
            tr.querySelector('td i').classList.add(`icon-${icon}`);
            tr.querySelector('td.display-name a').setAttribute('href', href);
            tr.querySelector('td.display-name a').innerHTML = filename;
        }
        else {
            const clone = tr.cloneNode(true);
            clone.querySelector('td i').classList.add(`icon-${icon}`);
            clone.querySelector('td.display-name a').setAttribute('href', href);
            clone.querySelector('td.display-name a').innerHTML = filename;
            tbody.append(clone);
        }
    });
    return doc.window.document.documentElement.outerHTML;
};
const getContentFile = (file, stopIt = false, files = []) => {
    const readFile = util.promisify(fs.readFile);
    const extname = path.extname(file.path);
    const contentType = getContentType(extname);
    return readFile(file.path, 'utf8')
        .then((response) => {
        let content = response;
        return new Promise((resolve, reject) => {
            try {
                if (files && files.length > 0) {
                    content = compileContent(response, files, file.base);
                }
                resolve({
                    error: '',
                    content: content,
                    contentType: contentType
                });
            }
            catch (e) {
                reject({
                    error: e,
                    content: 'error occurred',
                    contentType: contentType
                });
            }
        });
    })
        .catch((e) => {
        try {
            let filesInFolder = [];
            let content = '';
            if (e.code === 'ENOENT' && stopIt === false) {
                const html = path.join(__dirname, '..', '/template/404.html');
                return getContentFile({ path: html, base: file.base }, true);
            }
            if (e.code === 'EISDIR') {
                const html = path.join(__dirname, '..', '/template/root.html');
                filesInFolder = getFiles(file.path);
                return getContentFile({ path: html, base: file.base }, false, filesInFolder);
            }
            return new Promise((resolve, reject) => {
                if (e.error) {
                    reject({
                        error: e.error,
                        content: content,
                        contentType: contentType
                    });
                }
                else {
                    resolve({
                        error: e.code,
                        content: content,
                        contentType: contentType
                    });
                }
            });
        }
        catch (e) {
            return new Promise((resolve, reject) => {
                reject({
                    error: e,
                    content: null,
                    contentType: contentType
                });
            });
        }
    });
};
module.exports.buildPath = buildPath;
module.exports.getFiles = getFiles;
module.exports.getContentFile = getContentFile;
module.exports.compileContent = compileContent;
