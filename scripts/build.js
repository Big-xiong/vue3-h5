const path = require('path');
const fs = require('fs');
const spawn = require('./spawn'); // note-1 导入封装好的 spawn

const baseDir = path.join(__dirname, '../');

function removeDir(dir) {
  const files = fs.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    const newPath = path.join(dir, files[i]);
    const stat = fs.statSync(newPath);
    if (stat.isDirectory()) {
      // 如果是文件夹就递归下去
      removeDir(newPath);
    } else {
      // 删除文件
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir); // 如果文件夹是空的，就将自己删除掉
}

async function main() {
  let envFile;
  let content;
  const reg = /^VITE_APP_PROJECT_NAME=(.+)$/;

  try {
    envFile = fs.readFileSync(`${baseDir}./.env`);
    content = envFile.toString().split('\n');
  } catch (e) {
    console.log('This is dev env');
  }
  if (!envFile) {
    await spawn('npm', ['run', 'build:spa'], {
      cwd: baseDir,
      stdio: 'inherit'
    });
    return;
  }
  let templateName;
  content.map((item) => {
    const text = item.replace(/\s/g, '');
    const regRes = text.match(reg);
    if (regRes) {
      templateName = regRes[1];
    }
  });

  if (!templateName) throw new Error('检查商户号失败');

  await spawn(
    'wget',
    [
      `https://commonoverseas.binanlyst.com/h5/${templateName}.zip`,
      '--no-check-certificate',
      '--http-user=uikt',
      '--http-password=ne7ru',
      '--no-cache',
      '-O',
      'a.zip',
      '-q'
    ],
    {
      cwd: baseDir,
      stdio: 'inherit'
    }
  );

  try {
    const files = fs.readdirSync(`${baseDir}src/current_project`);
    if (files && files.length >= 0) {
      removeDir(`${baseDir}src/current_project`);
    }
  } catch (e) {
    console.log('remove fold error');
  }

  await spawn('unzip', ['-o', '-d', 'src/current_project', 'a.zip'], {
    cwd: baseDir,
    stdio: 'inherit'
  });

  await spawn('npm', ['run', 'build:spa', './', templateName], {
    cwd: baseDir,
    stdio: 'inherit'
  });

  await spawn('node', ['scripts/play-env'], {
    cwd: baseDir,
    stdio: 'inherit'
  });

  await spawn('npm', ['run', 'favicon'], {
    cwd: baseDir,
    stdio: 'inherit'
  });
}

main();
