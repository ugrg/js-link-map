/*
 * Author: bjiang
 * Create Time: 2020/1/14 19:16
 */

const fs = require("fs");
const path = require("path");
const resolve = require("./resolve");
const COLORS = {
  ".js": "#00d34b",
  ".less": "#9400d3",
  ".css": "#9400d3"
};
const reqReg = /require\(['"](\S+)['"]\)/g;
const impReg = /import\s.*?['"](\S+)['"]/g;
const loadImport = /import\(.*?['"](\S+)['"]\)/g;
const findImports = (file) => {
  let links = [], results;
  [reqReg, impReg, loadImport].forEach((reg) => {
    while ((results = reg.exec(file)) !== null) {
      links.push(results[1]);
    }
  });
  return links;
};
const resultModule = (root, color) => {
  return [root, {
    id: root, name: root, symbolSize: 5, itemStyle: { color }
  }, [], []];
};

function relyOn (source, cache, config) {
  if (/node_modules/.test(source)) return resultModule(source, "#A9A326");
  if ([".less", ".css", ".jpg", ".png", ".gif", ".jpeg", ".svg", ""].indexOf(path.extname(source)) !== -1) return resultModule(source, "#A94D82");
  const file = fs.readFileSync(source, "utf-8");
  const relativePath = path.relative(process.cwd(), source);
  const info = {
    id: relativePath,
    name: relativePath,
    symbolSize: Math.max(Math.min(20, file.length / 1024), 1),
    itemStyle: {
      color: COLORS[path.extname(relativePath)] || "#3634a9"
    }
  };
  const dirname = path.dirname(source);
  const links = findImports(file).map(target => resolve(target, dirname, config)).filter(Boolean);
  return [
    source,
    info,
    links.map((target) => ({ source: relativePath, target })),
    links.filter((key) => !(key in cache))
  ];
}

module.exports = function main (config) {
  let { root } = config;
  const data = {};
  const edges = [];
  root = fs.existsSync(root) ? root : path.join(process.cwd(), root);
  const tasks = [root];

  while (tasks.length > 0) {
    const [source, noteInfo, links, newTask] = relyOn(tasks.pop(), data, config);
    data[source] = noteInfo;
    edges.push(...links);
    tasks.push(...newTask);
  }
  return { name: root, data: Object.values(data), edges };
};
