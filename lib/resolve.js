/*
 * Author: bjiang
 * Create Time: 2020/1/15 8:29
 * 路径查找共分3大类，第一类是相对路径，直接join就可以得到结果。
 * 第二类是引用路径，通过alias来指定，需要进行路径替换
 * 第三类则是模块路径，这里我们并不打算把他计算出来，而是把模块当成一个整体。
 *
 * 模块路径的计算还有第二个步骤，需要计算整体实际路径，因为有大量的路径是被写成了简写。
 * 例如我们通常情况下是不写扩展名的，扩展名则是由一个指定的数组中尝试出来的。
 * 再比如在目标路径是一个目录，则会表示我们要在这个目录下加一个index再对扩展名查找。
 */

const path = require("path");
const fs = require("fs");

const findRel = (mod, dirname, alias) => {
  let rel = null;
  // 第一种情况，使用的相对路径
  if (/^\./.test(mod)) {
    rel = path.join(dirname, mod);
  } else {
    // 第二种情况，使用的alias替换
    rel = Object.entries(alias).reduce((p, [src, alias]) => {
      if (mod.indexOf(src) === 0) return path.join(alias, mod.replace(src, ""));
      return p;
    }, null);
  }
  // 第三种情况，node_modules
  if (rel === null) {
    let modName = mod.replace(/[\\\/].*$/g, "");
    let nodeModulesInPath = dirname, lastNodeModuleInsPath;
    do {
      rel = path.join(nodeModulesInPath, "node_modules", modName);
      [lastNodeModuleInsPath, nodeModulesInPath] = [nodeModulesInPath, path.dirname(nodeModulesInPath)];
    } while (!fs.existsSync(path.join(rel)) && lastNodeModuleInsPath !== nodeModulesInPath);
  }
  return rel;
};

function isDir (pathName) {
  return fs.existsSync(pathName) && fs.statSync(pathName).isDirectory();
}

module.exports = function main (mod, dirname, config) {
  let rel = findRel(mod, dirname, config.alias);
  // 没找到模块，直接丢弃吧
  if (rel === null) return null;
  // 如果是modules，则只反回一个目录名。
  if (rel.indexOf("node_modules") !== -1) return rel;
  // 如果是目录，则补充一个index上去。
  if (isDir(rel)) rel = path.join(rel, "index");
  if (fs.existsSync(rel)) return rel;

  return config.extensions.reduce((ret, ext) => fs.existsSync(`${rel}.${ext}`) ? `${rel}.${ext}` : ret, null);
};
