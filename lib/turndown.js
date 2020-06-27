import TurndownService from './turndown/src/turndown.js';

// var Diff = require('diff');

const oTurndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});

var turndownPluginGfm = require('turndown-plugin-gfm');
var gfm = turndownPluginGfm.gfm;

oTurndownService.use(gfm);

export { oTurndownService };