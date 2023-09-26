#! /usr/bin/env node
import ora from 'ora';
import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import { execSync as exec } from 'child_process';
import getEnv from '../src/utils/getEnv.mjs';

const __dirname = path.resolve();
const currentProjectPath = 'src/current_project';

const args = process.argv.slice(2);
const type = args[1];

let spinner;

if (type === 'micro') {
  step('10004');
} else if (args[0] !== undefined) {
  const numbers = args.filter((item) => /^\d+$/.test(item));
  step(...numbers);
} else {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入你要运行的商户号（5位纯数字）',
        validate(val) {
          if (!val.match(/^\d{5}$/g)) {
            // 校验位数
            return '请输入5位数字商户号';
          }
          return true;
        }
      }
    ])
    .then(async (answers) => {
      const { name } = JSON.parse(JSON.stringify(answers, null, '  '));
      step(name);
    });
}

async function step(name, subBranch) {
  const model = name.startsWith('5') ? 'overseas' : 'development';
  spinner = ora(`正在启动 ${name} 商户...`).start();
  const branchName = subBranch ? `${name}-${subBranch}` : name;
  if (!fs.existsSync(path.join(__dirname, currentProjectPath))) {
    spinner.text = `${currentProjectPath} 目录不存在，正在创建...`;
    exec(`mkdir -p ${path.join(__dirname, currentProjectPath)}`, { stdio: 'inherit' });
    spinner.text = '目录创建成功';
  }
  const git = simpleGit(path.join(__dirname, currentProjectPath));
  await init();

  async function init() {
    await git.remote('update');
    const remote = await git.remote(['-v']);

    const cloneBranch = async () => {
      await git.checkout(['-b', branchName]);
    };

    const fetch = async (branch, current) => {
      spinner.text = `正在检测 ${currentProjectPath} Git环境是否包含 ${branchName} 分支`;
      if (branch?.all?.includes?.(branchName)) {
        if (current !== branchName) {
          spinner.text = `正在拉取 ${currentProjectPath} 目录 ${branchName} 分支最新代码`;
          await git.checkout([branchName]);
        }
        await git.pull(['origin', branchName, '--allow-unrelated-histories']);
      } else {
        spinner.text = `${currentProjectPath} Git环境不包含 ${branchName} 分支，正在${
          subBranch ? `基于 ${name} 分支切换` : '拉取'
        }`;
        if (!branch?.all?.includes?.(name)) {
          await git.remote(['set-branches', 'origin', name]);
          await git.fetch(['origin', name, '--depth', 1]);
          await git.checkout([name]);
        } else {
          cloneBranch();
        }
      }
    };

    try {
      spinner.text = `正在检测 ${currentProjectPath} 目录是否存在git环境`;
      if (!remote.includes('common')) {
        spinner.text = `${currentProjectPath} 目录不存在Git环境，正在创建...`;
        await git.init().addRemote('origin', 'git@github.com:j33app2/overseas-h5-common.git');
        spinner.text = `${currentProjectPath} 目录Git环境创建成功`;
        await fetch();
      } else {
        const { current } = await git.status();
        const branch = await git.branch();
        await fetch(branch, current);
      }
      run();
    } catch (e) {
      console.log(`${e}\ngit脚本运行失败，请排查网络\n`);
      spinner.stop();
    }
  }

  async function run() {
    try {
      const usePordInterface = args.some((item) => item === 'pord');
      const envInfo = await getEnv(name, usePordInterface);
      exec(`${envInfo.str} vite --host --open ${name} --mode ${model}`, { stdio: 'inherit' });
    } catch (e) {
      console.log('服务已停止');
      spinner.stop();
    }
  }
}
