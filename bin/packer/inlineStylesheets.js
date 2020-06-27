#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

let inlineHtmlStyles = (htmlPath, sBasePath) => {
	const linkTagRegex = /<link (?:.* )?rel="stylesheet"(?:.* )?href="([\w.\-\/]+)".*>|<link (?:.* )?href="([\w.\-\/]+)"(?:.* )?rel="stylesheet".*>/;
	let html = fs.readFileSync(htmlPath).toString();
	let stylesheetPromises = (html.match(new RegExp(linkTagRegex, 'g')) || [])
		.map(linkTag => {
			let m = linkTag.match(linkTagRegex);
			return m[1] || m[2];
		})
		.map(sPath => sPath.replace(sBasePath, ''))
		.map(relPath => path.join(path.dirname(htmlPath), relPath))
		.map(stylesheetPath => `<!-- ${stylesheetPath} --><script>${fs.readFileSync(stylesheetPath).toString()}</script>`);
	// return Promise.all(stylesheetPromises).then(stylesheets =>
	// 	html.replace(new RegExp(linkTagRegex, 'g'), () =>
	// 		`<style>${stylesheets[i++]}</style>`));
	stylesheetPromises.forEach(stylesheets =>
		html = html.replace(
			new RegExp(linkTagRegex), 
			() => stylesheets //`<style>${stylesheets}</style>`
		)
	);
	fs.writeFileSync(htmlPath, html);
};

module.exports = inlineHtmlStyles;
