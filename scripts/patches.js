const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const type = args[0];

const fileName = 'vant+3.2.3.patch';

if (type === 'add') {
  const sourceFile = path.join(__dirname, `../patchesConfig/micro/${fileName}`);
  const destPath = path.join(__dirname, `../patches/${fileName}`);

  const readStream = fs.createReadStream(sourceFile);
  const writeStream = fs.createWriteStream(destPath);

  readStream.pipe(writeStream);
} else {
  try {
    fs.unlinkSync(path.join(__dirname, `../patches/${fileName}`));
  } catch (error) { }
}
