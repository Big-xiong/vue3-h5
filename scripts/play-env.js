require('dotenv').config();
const fs = require('fs');
const path = require('path');

let { VITE_APP_ASSET_PATH = '/images/' } = process.env;

if (!VITE_APP_ASSET_PATH.endsWith('/')) {
  VITE_APP_ASSET_PATH = `${VITE_APP_ASSET_PATH}/`;
}

let playHtml = fs.readFileSync(path.resolve('./dist/play.html')).toString();
try {
  if (fs.existsSync(path.resolve('./src/current_project'))) {
    playHtml = playHtml.replace('/images/play-loading.png', `${VITE_APP_ASSET_PATH}images/playLoading.jpg`);
    fs.copyFileSync(
      path.resolve('./src/current_project/assets/images/play-loading.jpg'),
      path.resolve('./dist/images/playLoading.jpg')
    );
  }
} catch (e) {
  console.log(e);
}

fs.writeFileSync(path.resolve('./dist/play.html'), playHtml);
