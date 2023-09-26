/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const rsync = require('rsyncwrapper');
const spawn = require('./spawn');

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

const cwd = path.join(__dirname, '../');
const argv = process.argv;
(async () => {
  let projectList = argv.filter((item) => /^\d{5}$/g.test(item));
  const isInit = [...argv].pop() === 'init';
  const isHelp = [...argv].pop() === 'help';
  const isAll = argv.some((item) => item === 'all');
  const isTiny = argv.some((item) => item === 'tiny');
  const isOnce = argv.some((item) => item === 'once');
  const isDel = argv.some((item) => item === 'del');
  const delPath = isDel ? [...argv.filter((item) => item !== 'del' && !/^\d{5}$/g.test(item))].pop().split(',') : null;
  if (isInit) {
    await spawn('mkdir', ['-p', 'subReplace/git'], {
      cwd,
      stdio: 'inherit'
    });
    await spawn('mkdir', ['-p', 'subReplace/result'], {
      cwd,
      stdio: 'inherit'
    });
    console.log('初始化完成，请把资源按照想要移动的目录放置在 subReplace/result 下面再次执行 npm run replace 即可');
    return;
  }

  if (isHelp) {
    console.log(`
      step1: 初始化脚本
             npm run replace init
             subReplace/git     // 临时git目录（勿动）
             subReplace/result  // 资源放置目录

      step2: 修改需要替换的资源
             进入 subReplace/result 放置想要替换的资源，目录层级与src/current_project目录严格一致.
             如资源每个商户不同，可在subReplace新建该商户号名称目录放置:
             subReplace/10004/xxx.xx
             subReplace/10005/xxx.xx

      step3: 执行替换
             如放置在 subReplace/result 目录下，即运行：
             npm run replace 10001 10002 // 会对10001 10002商户分别放置result目录下的文件
             如分别放置在 subReplace/10001 商户号文件夹下，即运行：
             npm run replace once 10001 10002 // 会分别替换商户号文件夹下的内容
             注意，以上两者单次运行只会生效一种模式

      step4: 删除目标资源
             执行 npm run replace del 10001 10002 'assets/images/home/vip,assets/images/xxx'
             需要删除的资源地址路径严格按照src/current_project，地址需要引号包裹，多个地址逗号分割
    `);
    return;
  }
  const git = simpleGit(path.join(__dirname, '../subReplace/git'));
  let remote = await git.remote(['-v']);
  if (!remote.includes('common')) {
    await git.init().addRemote('origin', 'git@github.com:j33app2/overseas-h5-common.git');
    remote = await git.remote(['-v']);
  }
  console.log(remote);
  await git.remote('update');

  if (isAll) {
    const allBranch = await git.branch('-r');
    projectList = Object.keys(allBranch.branches)
      .map((item) => item.replace('remotes/origin/', ''))
      .filter((item) => /^\d+$/.test(item) && item.charAt(0) === '1');
    // 由于批量处理数据量过大，可能出现中断情况，此时可以在这里写入已处理好的商户号排除，用完请删除
    const filterConfig = [];
    projectList = projectList.filter((item) => !filterConfig.includes(item));
  }

  if (!projectList.length) {
    console.log('参数缺失，请运行 npm run replace help 查看运行指南');
    return;
  }

  const { current } = await git.status();
  for await (const name of projectList) {
    if (current !== name) {
      if (isAll) {
        await git.checkout(['-b', name, `remotes/origin/${name}`]);
      } else {
        await git.remote(['set-branches', 'origin', name]);
        await git.fetch(['origin', name, '--depth', 1]);
        await git.checkout([name]);
      }
    }
    await git.pull(['origin', name, '--allow-unrelated-histories']);

    if (isDel && delPath.length) {
      delPath.forEach((item) => {
        removeDir(path.join(__dirname, `../subReplace/git/${item}`));
      });
    } else if (isTiny) {
      await spawn('node', ['scripts/tinypng.js', '-f', './subReplace/git/assets', '-deep'], {
        cwd,
        stdio: 'inherit'
      });
    } else {
      const isMoveOk = await moveFiles(name);
      if (!isMoveOk) {
        console.log(`${name} 分支存在移动异常，脚本结束`);
        git.clearQueue();
        return;
      }
    }
    console.log(`${name} 正在推送至远端仓库`);

    await git
      .add(['.'])
      .commit(`autoGit: ${isDel ? `删除${delPath.join(' ')}目录` : `批量${isTiny ? '压缩' : '复制'}文件`}`)
      .push('origin', name);
    console.log(`${name} 分支处理完成`);
  }

  console.log('处理完成，脚本执行结束。');

  function moveFiles(name) {
    return new Promise((resolve, reject) => {
      rsync(
        {
          src: path.join(__dirname, `../subReplace/${isOnce ? name : 'result'}/`),
          dest: path.join(__dirname, '../subReplace/git'),
          recursive: true
          // exclude: ['*.txt'],
        },
        (error, stdout, stderr, cmd) => {
          resolve(!error);
        }
      );
    });
  }
})();
