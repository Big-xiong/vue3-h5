if ! command -v brew &> /dev/null
then
  echo "homebrew 没有安装，是否安装？(y/n)"
  read installBrew
  case $installBrew in
        [Yy]* ) /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; break;;
        [Nn]* ) exit;;
        * ) echo "请输入y或者n"; exit;;
  esac
fi


if ! command -v gdcloud &> /dev/null
then
  echo "谷歌云sdk 没有安装，是否安装？(y/n)"
  read installGoogle
  case $installGoogle in
        [Yy]* ) brew install --cask google-cloud-sdk; break;;
        [Nn]* ) exit;;
        * ) echo "请输入y或者n"; exit;;
  esac
fi

echo "请按照下面提示把代码添加到对应的文件中，取决于使用哪个shell程序:"

brew info google-cloud-sdk

