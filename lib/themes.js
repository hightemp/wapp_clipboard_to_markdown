
//requiring path and fs modules
const path = require('path');
const fs = require('fs');

export function fnGetAllThemes() 
{
  const directoryPath = path.join(__dirname, '../node_modules/codemirror/theme');
  var aFiles = fs.readdirSync(directoryPath);

  return aFiles;
}

export const aThemes = fnGetAllThemes();

fs.writeFileSync("themes.json", JSON.stringify(aThemes, null, 4));