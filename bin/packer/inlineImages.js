#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

let inlineImages = (htmlPath, sBasePath) => {
	const imgTagRegex = /<img (.* )?src="([\w.\-\/]+)"(.*)>/;
	let html = fs.readFileSync(htmlPath).toString();
	let imgPromises = (html.match(new RegExp(imgTagRegex, 'g')) || [])
		.map(imgTag => imgTag.match(imgTagRegex)[2])
		.map(sPath => sPath.replace(sBasePath, ''))
		.map(relImgPath => path.join(path.dirname(htmlPath), relImgPath))
		.map(imgPath => fs.readFileSync(imgPath).toString());
	// return Promise.all(imgPromises).then(images =>
	// 	html.replace(new RegExp(imgTagRegex, 'g'), (_match, p1, p2, p3) =>
	// 		`<img ${p1 || ''}src="data:${getMimeType(p2.split('.').pop())};base64, ${images[i++].toString('base64')}"${p3}>`
	// 	));
	imgPromises.forEach(images =>
		html = html.replace(
			new RegExp(imgTagRegex), 
			(_match, p1, p2, p3) => `<img ${p1 || ''}src="data:${getMimeType(p2.split('.').pop())};base64, ${images.toString('base64')}"${p3}>`
		)
	);
	fs.writeFileSync(htmlPath, html);
};

let getMimeType = ext => {
	switch (ext) {
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg';
		case 'svg':
			return 'image/svg+xml';
		case 'gif':
		case 'png':
		case 'webp':
			return `image/${ext}`;
		default:
			return 'application/octet-stream';
	}
};

module.exports = inlineImages;
