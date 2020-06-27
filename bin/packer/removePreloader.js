// <link rel="preload"[^>]>

const fs = require('fs');
const path = require('path');

let inlineHtmlStyles = (htmlPath, sBasePath) => {
	const linkTagRegex = /<link rel="preload"[^>]*>/;
	let html = fs.readFileSync(htmlPath).toString();
  let linksPromises = (html.match(new RegExp(linkTagRegex, 'g')) || []);
  
	linksPromises.forEach(link =>
		html = html.replace(
			new RegExp(linkTagRegex), 
			() => ''
		)
	);
	fs.writeFileSync(htmlPath, html);
};

module.exports = inlineHtmlStyles;