const { execSync } = require('child_process');
const { existsSync } = require('fs');

try {
  if (existsSync('src/current_project')) {
    execSync('rm -rf src/current_project')
    execSync('git add src/current_project')
  }

  execSync('git submodule add --depth=1 git@github.com:j33app2/overseas-h5-common.git src/current_project', {
    stdio: 'inherit'
  });
  execSync('git submodule init');
  execSync('git submodule update --depth 1 --remote');
  console.log('success');
} catch (e) { }




