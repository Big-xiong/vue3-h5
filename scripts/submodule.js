const { execSync } = require('child_process');

const args = process.argv.slice(2);
const templateName = args[0];

try {
  execSync(`git remote set-branches origin ${templateName}`, {
    cwd: 'src/current_project'
  });
  execSync(`git fetch --depth 1 origin ${templateName}`, {
    cwd: 'src/current_project'
  });
  execSync(`git checkout ${templateName}`, {
    cwd: 'src/current_project'
  });

  execSync(`sed -i.bak -E 's/^VITE_APP_PROJECT_NAME(.+)/#VITE_APP_PROJECT_NAME\\1/' .env`);
  execSync(`sed -i.bak -E 's/^#(.+)${templateName}/VITE_APP_PROJECT_NAME=${templateName}/g' .env`);
  execSync('rm .env.bak');
} catch (e) {
  console.error(`\n启动失败，请检查\n1.子仓库是否有代码未提交\n2.子商户是否存在 ${templateName} 分支\n3.存在网络原因`);
}
