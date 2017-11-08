#!/usr/bin/env fibjs

const copy = require('@fibjs/copy');
const mkdirp = require('@fibjs/mkdirp');
const fs = require('fs');
const path = require('path');

const venderPath = path.join(__dirname, '../vender');
const prjRootPath = path.join(__dirname, '..');

const ignores = [
  'out',
  'bin',
  'vender',
  '.git',
  'build.cmd',
  'fibjs_vender.sln',
].map(p => path.join(prjRootPath, p));

if (!fs.exists(venderPath)) {
  mkdirp(venderPath);
}

copy(prjRootPath, venderPath, (data, dir) => {
  const ignore = ignores.some(p => dir.src.startsWith(p));
  if (ignore) {
    return false
  }

  return data;
});

if (process.platform !== 'win32') {
  const execCmd = path.join(venderPath, 'build');
  fs.chmod(execCmd, 0700);
  process.chdir(venderPath);
  process.run('./build', ['-j']);
} else {
  process.chdir(prjRootPath);
  process.run('cmd', ['/c', 'build.cmd']);
}
