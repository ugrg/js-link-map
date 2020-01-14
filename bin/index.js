#!/usr/bin/env node

/*
 * Author: ugrg
 * Create Time: 2020/1/14 17:30
 */

const commander = require("commander");
const _package = require("../package");
const run = require("../lib/main");
const program = new commander.Command();
program.version(_package.version, undefined, "获取当前版本信息!");
program.helpOption(undefined, "获取帮助信息!");

program.option("-r, --root <string>", "根文件路径", "index.js");
program.option("-e, --extends <string>", "要排除的路径", "node_module");

program.parse(process.argv);

run(program.opts());
