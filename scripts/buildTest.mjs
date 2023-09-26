#! /usr/bin/env node
/* eslint-disable no-restricted-syntax */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';
import { execSync as exec } from 'child_process';
import getEnv from '../src/utils/getEnv.mjs';

const __dirname = path.resolve();

const args = process.argv.slice(2);
const [name, subBranch] = args;

const currentProjectPath = 'src/current_project';

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

(async () => {
  if (fs.existsSync('src/current_project')) {
    removeDir('src/current_project');
  }
  fs.mkdir(path.join(__dirname, currentProjectPath), {}, async () => {
    init();
  });
})();

async function init() {
  const git = simpleGit(path.join(__dirname, currentProjectPath));

  const fetch = async () => {
    const branchName = subBranch ? `${name}-${subBranch}` : name;
    await git.remote(['set-branches', 'origin', branchName]);
    await git.fetch(['origin', branchName, '--depth', 1]);
    await git.checkout([branchName]);
  };

  try {
    await git.init().addRemote('origin', 'git@github.com:j33app2/overseas-h5-common.git');
    await fetch();

    const envInfo = await getEnv(name);
    await exec(`${envInfo.str} npx vite build ./ ${name}`, { stdio: 'inherit' });
    await exec('npm run favicon', { stdio: 'inherit' });
  } catch (e) {
    throw new Error(`\ngit脚本运行失败，请排查网络\n${e}`);
  }
}
