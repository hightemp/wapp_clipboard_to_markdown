const { inlineSource } = require('inline-source');
const fs = require('fs');
const path = require('path');
const htmlpath = path.resolve('./dist/index.html');

const consola = require('consola');

inlineSource(htmlpath, {
  compress: true,
  rootpath: path.resolve('./dist'),
  // Skip all css types and png formats
  ignore: []
})
.then((html) => {
  var sPath = path.dirname(htmlpath);
  var sFilePath = path.join(sPath, 'index.packed.html');
  fs.writeFileSync(sFilePath, html);
  consola.success('all done');
  console.log('--------------------------');
})
.catch((err) => {
  consola.error(err);
});