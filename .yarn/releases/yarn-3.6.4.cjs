#!/usr/bin/env node

// This file is a placeholder for the yarn-3.6.4.cjs file.
// In a real scenario, you would download the actual Yarn 3.6.4 release file from
// https://github.com/yarnpkg/berry/releases/download/3.6.4/yarn-3.6.4.cjs

// This placeholder allows the project to recognize the yarn path specified in .yarnrc.yml
// For actual use, replace this with the official release file

console.log('Yarn 3.6.4 initialized');

// Forward to the system's yarn command for actual functionality
const { spawnSync } = require('child_process');
const args = process.argv.slice(2);

const result = spawnSync('yarn', args, { stdio: 'inherit' });
process.exit(result.status);