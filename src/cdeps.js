import crequire from 'crequire';
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';

function endWith(f, str) {
  return f.slice(-str.length).toLowerCase() === str.toLowerCase();
}

function isRelative(filepath) {
  return filepath.charAt(0) === '.';
}

/**
 * Test and return the corrent file.
 * @param f {String}
 * @returns {String}
 */
function getFile(f) {
  // 1. end with .js or .css and exists, return file
  // 2. not end with .js
  // 2.1 add .js and exists, return file
  // 2.2 add /index.js and exists, return file
  // null

  if (endWith(f, '.js') && existsSync(f)) return f;
  if (!endWith(f, '.js')) {
    if (existsSync(f + '.js')) return f + '.js';
    if (existsSync(f + '/index.js')) return f + '/index.js';
  }

  return null;
}

/**
 * Get deps of a file.
 * @param f {String} file
 * @returns {Array}
 */
function parseDeps(f) {
  function getPath(o) {
    return o.path;
  }

  const content = readFileSync(f, 'utf-8');
  if (endWith(f, '.js')) {
    return crequire(content).map(getPath);
  }

  return [];
}

function parse(entry) {
  const f = getFile(entry);
  if (!f) return [];

  let deps = [entry];
  parseDeps(f).forEach(dep => {
    if (isRelative(dep)) {
      const nextDep = resolve(dirname(f), dep);
      deps = deps.concat(parse(nextDep));
    }
  });
  return deps;
}

export default function cdeps(entry) {
  return parse(entry);
}
