#! /usr/bin/env node
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const exec = require('child_process').execSync;

const currentProjectPath = '../src/current_project';

step('10004');

async function step(name) {
  try {
    fs.statSync(path.join(__dirname, currentProjectPath));
    await init();
  } catch (error) {
    console.log(`\n${currentProjectPath}目录不存在，正在创建...`);
    fs.mkdir(path.join(__dirname, currentProjectPath), {}, async () => {
      console.log(`\n目录创建成功`);
      await init();
    });
  }

  async function init() {
    const git = simpleGit(path.join(__dirname, currentProjectPath));
    const remote = await git.remote(['-v']);

    const fetch = async () => {
      await git.remote(['set-branches', 'origin', name]);
      await git.fetch(['origin', name]);
      await git.checkout([name]);
      exec(`sed -i.bak -E 's/^VITE_APP_PROJECT_NAME(.+)/#VITE_APP_PROJECT_NAME\\1/' .env`);
      exec(`sed -i.bak -E 's/^#(.+)${name}/VITE_APP_PROJECT_NAME=${name}/g' .env`);
      exec('rm .env.bak');
    };

    try {
      if (!remote.includes('common')) {
        console.log(`\n${currentProjectPath} 目录没有.git目录，正在初始化...`);
        await git.init().addRemote('origin', 'git@github.com:j33app2/overseas-h5-common.git');
        await fetch();
        console.log(`\n初始化成功\n`);
      } else {
        const { current } = await git.status();
        const branch = await git.branch();
        if (branch.all.includes(name)) {
          if (current !== name) await git.checkout([name]);
          await git.pull(['origin', name]);
        } else {
          await fetch();
        }
      }
      run();
    } catch (e) {
      console.log('\ngit脚本运行失败，请排查网络\n');
    }
  }

  function run() {
    try {
      exec(`npm run build:micro`, { stdio: 'inherit' });
    } catch (e) {
      console.log('服务已停止');
    }
  }
}
