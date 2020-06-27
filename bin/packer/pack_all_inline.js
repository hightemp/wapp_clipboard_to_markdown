// let inlineScriptTags = require('./inlineScriptTags');
// let inlineRequires = require('./inlineRequires');
// let inlineEnvironmentVariables = require('./inlineEnvironmentVariables');

// module.exports = {inlineScriptTags, inlineRequires, inlineEnvironmentVariables};

// var oNuxtConf = require('../../nuxt.config').default;
import oNuxtConf from '../../nuxt.config';
var sBase = oNuxtConf.router.base;

const aFunctions = [
  require('./inlineScriptTags'),
  require('./inlineStylesheets'),
  require('./inlineImages'),
  require('./removePreloader')
];

const path = require('path');

const sRootPath = path.dirname(path.dirname(__dirname));
const sIndexFilePath = path.join(sRootPath, 'dist/index.html');

(function () {
  for (var fnV of aFunctions) {
    // console.log(`>>>> ${fnV}`);
    console.log('-----------');
    fnV(sIndexFilePath, sBase);
  }
})();

