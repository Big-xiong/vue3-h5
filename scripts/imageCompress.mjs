import glob from 'fast-glob';
import tinify from 'tinify';
import fs from 'fs';
import path from 'path';

// 修改这个key
tinify.key = '4W3wS5gpkmRJtF4Ldpbp1XHY8P6MGNKJ';

const logFile = './image-compressed.log';
let wroteFils = [];

(async () => {
  let files = glob.sync(`../src/assets/native-sports/{images,dark}/**/*.{png,jpg}`,);

  if (fs.existsSync(logFile)) {
    wroteFils = fs.readFileSync(logFile).toString().split('\n');
  }

  for (const file of files) {
    if (wroteFils.includes(file)) {
      continue
    }
    const source = tinify.fromFile(file)
    await source.toFile(file);
    fs.appendFileSync(logFile, file + '\n');
    wroteFils.push(file);
    console.log('compressed ', file)
  }
})()
