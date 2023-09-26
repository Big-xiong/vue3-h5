const path = require('path');
const fs = require('fs');

const fileName = '../src/current_project/assets/favico.ico';

const sourceFile = path.join(__dirname, fileName);
const distPath = path.join(__dirname, '../dist', 'favicon.ico');

fs.writeFileSync(distPath, fs.readFileSync(sourceFile));
