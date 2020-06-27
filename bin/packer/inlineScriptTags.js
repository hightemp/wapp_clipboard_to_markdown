#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

let inlineHtmlScripts = (htmlPath, sBasePath) => {
	const scriptTagRegex = /<script[^>]*src="([\w.\-\/]+)"[^>]*>[^<]*<\/script>/;
	let html = fs.readFileSync(htmlPath).toString();
	console.log('>>>', htmlPath, sBasePath);
	let scriptPromises = (html.match(new RegExp(scriptTagRegex, 'g')) || [])
		.map(scriptTag => scriptTag.match(scriptTagRegex)[1])
		.map(sPath => sPath.replace(sBasePath, ''))
		.map(sPath => { console.log('>>>', sPath); return sPath;})
		.map(relScriptPath => path.join(path.dirname(htmlPath), relScriptPath))
		.map(scriptPath => `<!-- ${scriptPath} --><script>${fs.readFileSync(scriptPath).toString()}</script>`);
	scriptPromises.forEach(scripts =>
		html = html.replace(
			new RegExp(scriptTagRegex), 
			() => scripts //`<!-- --><script>${scripts}</script>`
		)
	);
	fs.writeFileSync(htmlPath, html);
};

let inlineHtmlLinkScripts = (htmlPath, sBasePath) => {
	// <link rel="preload" href="/wapp_clipboard_to_markdown/dist/_nuxt/runtime.babbcbb.js" as="script">
	const scriptTagRegex = /<link[^>]*href="([^>]*)"[^>]*as="script">/;
	let html = fs.readFileSync(htmlPath).toString();
	console.log('>>>', htmlPath, sBasePath);
	let scriptPromises = (html.match(new RegExp(scriptTagRegex, 'g')) || [])
		.map(scriptTag => scriptTag.match(scriptTagRegex)[1])
		.map(sPath => sPath.replace(sBasePath, ''))
		.map(sPath => { console.log('>>>', sPath); return sPath;})
		.map(relScriptPath => path.join(path.dirname(htmlPath), relScriptPath))
		.map(scriptPath => fs.readFileSync(scriptPath).toString());
	scriptPromises.forEach(scripts =>
		html = html.replace(
			new RegExp(scriptTagRegex, 'g'), 
			() => `<script>${scripts}</script>`
		)
	);
	fs.writeFileSync(htmlPath, html);
};

module.exports = (htmlPath, sBasePath) => {
	inlineHtmlScripts(htmlPath, sBasePath);
	// inlineHtmlLinkScripts(htmlPath, sBasePath);
};
