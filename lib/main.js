/*
 * Author: ugrg
 * Create Time: 2020/1/14 18:01
 */

const handler = require("serve-handler");
const http = require("http");
const path = require("path");
const open = require("open-browsers");
const relyOn = require("./relyOn");
const CT = {};
const DB = new Promise((resolve, reject) => {
  Object.assign(CT, { resolve, reject });
});
const server = http.createServer((req, res) => {
  if (req.url === "/data") {
    return DB.then((db) => res.end(JSON.stringify(db)));
  } else {
    return handler(req, res, { public: path.join(__dirname, "../public") });
  }
});

server.listen(7389, () => {
  console.info("running at http://localhost:7389");
  open("http://localhost:7389");
});

module.exports = function main (config) {
  CT.resolve(relyOn(config));
};
