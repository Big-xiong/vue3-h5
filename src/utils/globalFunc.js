/* eslint-disable no-param-reassign */
import Cookies from 'js-cookie';
import { Toast } from 'vant';
import { createSocket, onCloseWS } from '@/plugins/socket';
import { openGame } from '@/api/app';

export default (app, store, router) => {
  // 进游戏相关
  let gamePlayWin;
  app.config.globalProperties.$goGame = (val) => {
    store.state?.game?.gameCatePlatforms.forEach((item) => {
      if (val.game_cate_id === item.game_cate_id) {
        item.platform_list.forEach((a) => {
          if (a.game_platform_id === val.platform_id) {
            const obj = {
              default_game_id: a.default_game_id,
              platform_id: val.platform_id,
            };
            app.config.globalProperties.$playGame(obj);
          }
        });
      }
    });
  };
  app.config.globalProperties.$hideUsername = (username) => `${username.substr(0, 2)}***${username.substr(username.length - 1)}`;
  app.config.globalProperties.$platformName = (platformId, platforms) => {
    if (platforms && platforms[platformId]) {
      return platforms[platformId];
    }
    return platformId;
  };

  const openUrl = (url) => {
    // 生成一个a元素
    const a = document.createElement('a');
    // 创建一个单击事件
    const event = new MouseEvent('click');
    a.target = '_blank';
    // 将生成的URL设置为a.href属性
    a.href = url;
    // 触发a的单击事件
    a.dispatchEvent(event);
  };

  app.config.globalProperties.$getWashRate = (game, type) => {
    const { dicts } = store.state.app;
    const gameIds = dicts.platformgameidsv2;
    if (!gameIds?.length) return '0';
    const { list_data } = gameIds.find((item) => item.name === type) ?? {};
    return list_data?.find?.((item) => item.name?.toLowerCase?.() === game?.name?.toLowerCase?.())?.wash_rate ?? 0;
  };

  const getTargetGameInfo = (target, game) => target.code === game.name.toLowerCase()
    || target.name.toLowerCase() === game.name.toLowerCase()
    || target.name.toLowerCase() === game.title
    || target.default_game_id === game.default_game_id;

  app.config.globalProperties.$getGameStatus = (game, type) => {
    const { platformGameIdsv3 } = store.state.game;
    if (platformGameIdsv3.length) {
      type = /^\d+$/g.test(type) ? type : platformGameIdsv3.find((item) => item.name === type)?.game_cate_id;
      const targetArr = platformGameIdsv3.format[type];
      if (targetArr) {
        const target = targetArr.find((item) => getTargetGameInfo(item, game));
        return target?.status === 2;
      }
    }
    return false;
  };

  app.config.globalProperties.$playGame = (game, type, index) => {
    const { isLogin, walletInfo = {} } = store.state.user;
    const { dicts } = store.state.app;
    const { platformGameIdsv3 } = store.state.game;
    const token = Cookies.get('access_token');

    if (isLogin) {
      let gameId = game?.default_game_id ?? game?.game_id ?? game.id;
      let platformId = game?.game_platform_id ?? game?.platform_id;
      let cateId = game?.game_cate_id; // bug: #19592 点击彩票、体育底部进入游戏，无法正确显示额度转账的转入钱包名称
      let status = game.status;
      if (!game.created_at) {
        if (!cateId) {
          cateId = cateId ?? platformGameIdsv3.find((item) => item.game_cate_id === type || item.name === type)?.game_cate_id;
        }

        if (type === 'v2') {
          const gameIds = dicts.platformgameidsv2;
          const target = gameIds
            .find((item) => item.game_cate_id === cateId)
            ?.list_data?.find?.((item) => item.name.toLowerCase() === game.name);
          const defaultGameIds = target.default_game_id?.split?.(',') ?? [];
          if (defaultGameIds.length) gameId = defaultGameIds[index];
        } else {
          const target = platformGameIdsv3.format?.[cateId]?.find?.((item) => getTargetGameInfo(item, game));
          if (target) {
            const { status: targetStatus, default_game_id, platform_id } = target;
            status = targetStatus;
            gameId = default_game_id;
            platformId = platform_id;
          } else if (!['10001', '10029'].includes(import.meta.env.VITE_APP_PROJECT_NAME)) {
            status = 2;
          }
        }
      }

      if (!gameId || !platformId) {
        Toast.fail(window.$t('该游戏暂不可用'));
        return;
      }

      if (status === 2) {
        Toast.fail(window.$t('该游戏正在维护中'));
        return;
      }

      const goGame = async () => {
        if (walletInfo.open_mode === 2 || walletInfo.is_auto_trans === 2) {
          app.config.globalProperties.$popup({
            tpl: 'TransferPopup',
            gameId,
            platformId,
            cateId,
          });
          return;
        }
        // Toast.loading({
        //   forbidClick: true,
        //   duration: 0,
        // });
        // const gameData = '';

        // try {
        //   gameData = await openGame({
        //     game_id: gameId,
        //     platform_id: platformId,
        //   });
        //   Toast.clear();
        // } catch (e) {
        //   Toast.clear();
        //   return;
        // }

        const routeUrl = `http://${location.host}/play.html?at=${token}&game_id=${gameId}&cate_id=${cateId}&platform_id=${platformId}`;
        // 处理vr游戏 电子游戏
        if (
          [121].includes(platformId)
          || ([2].includes(cateId) && [3].includes(platformId))
          || dicts.allplatform[platformId] === 'PT'
        ) {
          gamePlayWin?.close?.();
          gamePlayWin = window.open(routeUrl, 'gamePlayWin');
        } else {
          window.open(routeUrl, '_blank');
        }
      };

      // 判断余额
      if (+walletInfo?.money + +walletInfo?.all_platform_money + +walletInfo?.financing_money <= 10) {
        app.config.globalProperties.$popup({
          tpl: 'MoneyPopup',
          gameId,
          platformId,
          cateId,
          at: token,
          confirm() {
            router.push({ name: 'centerDeposit' });
          },
          cancel() {
            goGame();
          },
        });
        return;
      }
      // TODO 本地判断是否新手
      // let str = userInfo.id
      // let isFirstTime = JSON.parse(Cookies.get(str) || '[]')
      // if (isFirstTime.indexOf(gameId) < 0) {
      //   isFirstTime.push(gameId)
      //   window.localStorage.setItem(str, JSON.stringify(isFirstTime))
      //   firstPop.install({
      //     gameId,
      //     platformId,
      //     cateId,
      //     at: token
      //   })
      //   return
      // }
      goGame();
    } else {
      app.config.globalProperties.$dialog({ tpl: 'LoginDialog' });
    }
  };

  /* eslint-disable */
  app.config.globalProperties.$openKefu = (val) => {
    console.log(1);
    const {
      app: {
        dicts: { siteinfo }
      },
      user: { userInfo }
    } = store.state;
    let { kf_online_type } = siteinfo ?? {};
    let params = '';
    const { email, username, mobile } = userInfo;
    if (userInfo?.username) {
      if (kf_online_type === 1) {
        params = `?params={"username":"${username}"}`;
      } else {
        params = `?params={"email":"${email}","username":"${username}","mobile":"${mobile}"}`;
      }
    }
    const isFloat = kf_online_type === 2;
    if (isFloat) {
      const lang = window.location.pathname.split('/')[1] || 'en';
      const base = import.meta.env.DEV || !window.subConfig.isI18n ? '' : `/${lang}`;
      window.location = `${base}/kefu/index.html${params}#hs-chat-open`;
    } else {
      let url = (siteinfo && siteinfo.pc_kf) || '';
      if (url) {
        if (userInfo && userInfo.username) {
          if (url.includes('aichat')) {
            if (url.includes('referrer')) {
              url = `${url}?params={"username":"${userInfo.username}"}`;
            } else {
              url = `${url}&params={"username":"${userInfo.username}"}`;
            }
          }
        }
        window.open(`/kefu.html?link=${url}`, '_blank');
      }
    }
  };
};
