<template>
  <div id="welfare">
    <van-nav-bar
      :title="title"
      v-if="source !== 'app'"
      left-arrow
      @click-left="$router.go(-1)"
    ></van-nav-bar>
    <div class="content">
      <div class="content-header">
        <img :src="$getSrc(`/src/assets/images/activity/zh-CN/bnbDetail/bian-icon.png`)" alt="">
        <span>{{$t('币安')}}</span>
        <van-icon class="header-icon" name="arrow" />
      </div>
      <van-tabs @change="onTableChange" style="color:#fff" :ellipsis="false" v-model:active="index">
          <van-tab :title="menu.title" v-for="menu in menus" :key="menu.id">
            <template v-if="menu.id === 0">
              <div class="tab-info">
                <div class="info-header">
                  <div class="info-header-title">{{$t('注意事项')}}</div>
                  <p class="info-header-desc" v-for="(title, index) in headerList" :key="index">
                    {{title}}
                  </p>
                </div>
                <div class="info-item" v-for="(item, index) in content" :key="index">
                    <div class="item-title" v-if="item.title">{{item.title}}</div>
                    <div class="item-desc" v-if="item.desc">{{item.desc}}</div>
                    <img
                      class="item-img"
                      :src="item.imgUrl"
                    />
                </div>
              </div>
            </template>
            <template v-else>
              <div class="tab-info">
                <div class="info-item" v-for="(item, index) in content" :key="index">
                    <div class="item-title" v-if="item.title">{{item.title}}</div>
                    <div class="item-desc" v-if="item.desc">{{item.desc}}</div>
                    <img
                      class="item-img"
                      :src="item.imgUrl"
                    />
                </div>
              </div>
            </template>
          </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue';

export default defineComponent({
  inject: ['global', 'subConfig'],
   data() {
    return {
      title: '了解虚拟币',
      index: 0,
      menus: [{
        title: this.$t('下载注册认证'),
        id: 0,
      }, {
        title: this.$t('购买USDT'),
        id: 1,
      }, {
        title: this.$t('平台USDT存款'),
        id: 2,
      }, {
        title: this.$t('平台USDT取款'),
        id: 3,
      }, {
        title: this.$t('USDT兑换人民币'),
        id: 4,
      }],
      headerList: [
        this.$t('操作时请尽快完成[购买USDT]与[平台USDT存款]步骤，以免长时间未完成操作导致二维码失效。'),
        this.$t('请购买与存款页面所相对应的USDT类型，如在存款页面选择ERC20则购买时也选择ERC20，不同类型转账将导致失败。'),
        this.$t('转出时需要支付少量手续费，请在买币前联系火币客服了解手续费数量。'),
        this.$t('若三次取消交易当日将无法再进行买入。'),
        this.$t('如遇商家网站无法打开时建议尝试更换浏览器或开启VPN进行操作。'),
        this.$t('进行任意交易前请确认好信息。'),
        this.$t('本教程为热门交易所功能介绍，不负责担保任何交易结果，使用中若遇到操作、账户类的问题，请在火币[帮助中心]联系[在线客服]。'),
        this.$t('若交易所的内容有所变更，一切以交易所官方信息为准。'),
      ],
    };
  },
  computed: {
    content() {
      let _data = [];
      switch (this.menus[this.index].id) {
        case 0:
          _data = [{
            title: this.$t('步骤1/6'),
            desc: this.$t('您可在此处下载币安App。安卓下载安装后可直接打开App注册，IOS请参考后面的步骤'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-1.png'),
          }, {
            title: this.$t('步骤2/6'),
            desc: this.$t('点击[IOS内测版]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-2.png'),
          }, {
            desc: this.$t('[点击下载TestFlight]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-3.png'),
          }, {
            desc: this.$t('点击[获取]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-4.png'),
          }, {
            title: this.$t('步骤3/6'),
            desc: this.$t('TestFlight下载完毕后返回浏览器[点击下载Binance App]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-5.png'),
          }, {
            desc: this.$t('在欢迎页面中点击[继续]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-6.png'),
          }, {
            title: this.$t('步骤4/6'),
            desc: this.$t('点击[安装]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-7.png'),
          }, {
            desc: this.$t('安装完毕后打开App点击[下一步]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-8.png'),
          }, {
            desc: this.$t('点击[开始测试]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-9.png'),
          }, {
            title: this.$t('步骤5/6'),
            desc: this.$t('输入手机号与密码后点击[注册]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-10.png'),
          }, {
            desc: this.$t('输入收到的验证码后[提交]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-11.png'),
          }, {
            desc: this.$t('此时您已经拥有了币安账号并正处于登录状，点击左上角头像，开始认证。认证后方可进行交易'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-12.png'),
          }, {
            title: this.$t('步骤6/6'),
            desc: this.$t('点击账号后方的[去认证]字样'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-13.png'),
          }, {
            desc: this.$t('开始[认证]，建议完成高级认证'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/1-14.png'),
          }];
          break;
        case 1:
          const _oneImgUrl = this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/2-1.png');
          const _desc1 = this.$t(`打开${this.subConfig.title}[存款]选择[虚拟币充值]-[ERC20]并填写存入金额后点击[立即存款]`);
          // if (this.$projectname !== 'wanqu') {
          //   _oneImgUrl = this.$getSrc(`/src/assets/images/activity/zh-CN/bnbDetail/2-1-${this.$projectname}.png`);
          // }
          // if ( this.$projectname === '10062' ) {
          //   _oneImgUrl = this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/2-1-1.png');
          // }
          _data = [{
            title: this.$t('步骤1/6'),
            desc: _desc1,
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/2-1.png'),
          }, {
            title: this.$t('步骤2/6'),
            desc: this.$t('将二维码页面截图保存至相册。二维码即平台的收款地址，28.944USDT代表您填写的人民币对应的USDT数量'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/2-2.png'),
          }, {
            title: this.$t('步骤3/6'),
            desc: this.$t('在首页的[更多]中联系客服咨询转账手续费，然后至[快捷买币]中购买USDT'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/2-3.png'),
          }, {
            title: this.$t('步骤4/6'),
            desc: this.$t('在[自选区]找到合适的卖家点击[购买]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/2-4.png'),
          }, {
            title: this.$t('步骤5/6'),
            desc: this.$t('按[购买数量]填写后[购买USDT]。购买数量=存款页面显示的转入USDT数+手续费'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/2-5.png'),
          }, {
            desc: this.$t('在[请付款]页面点击[付款方式]查看后选择您想使用的方式付款，下方可复制对方收款账户'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/2-6.png'),
          }, {
            title: this.$t('步骤6/6'),
            desc: this.$t('付款后返回交易页面[确认]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/2-7.png'),
          }, {
            desc: this.$t('确认后即完成交易，点击[划转到现货钱包]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/2-8.png'),
          }];
          break;
        case 2:
          _data = [{
            title: this.$t('步骤1/7'),
            desc: this.$t('点击首页左上方头像，在[我的]点击[设置]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/3-1.png'),
          }, {
            title: this.$t('步骤2/7'),
            desc: this.$t('在[设置]中点击[提现地址]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/3-2.png'),
          }, {
            title: this.$t('步骤3/7'),
            desc: this.$t('[添加新地址]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/3-3.png'),
          }, {
            title: this.$t('步骤4/7'),
            desc: this.$t('选择USDT并选择[ERC20]，使用页面中的扫码功能扫描刚刚保存在相册中的二维码，勾选[加入白名单]后保存'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/3-4.png'),
          }, {
            title: this.$t('步骤5/7'),
            desc: this.$t('在[资金]中点击[提现]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/3-5.png'),
          }, {
            title: this.$t('步骤6/7'),
            desc: this.$t('在[数字货币]的[币种列表]选中[USDT]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/3-6.png'),
          }, {
            title: this.$t('步骤7/7'),
            desc: this.$t('选择[ERC20]后在地址簿中选择刚刚添加的平台存款地址并输入[提现金额]后[提现]。提现金额=存款页面显示的转入USDT数+手续费'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/3-7.png'),
          }];
          break;
        case 3:
          let _fourImgUrl = this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/4-4.png');
          let _fiveImgUrl = this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/4-5.png');
          const _desc = this.$t(`将您的币安收款地址与${this.subConfig.title}账户绑定`);
          if (this.$projectname === '10029') {
            _fourImgUrl = this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/4-4-0.png');
            _fiveImgUrl = this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/4-5-0.png');
          }
          _data = [{
            title: this.$t('步骤1/2'),
            desc: this.$t('在[资产]中点击[充币]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/4-1.png'),
          }, {
            desc: this.$t('搜索[USDT]并选中'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/4-2.png'),
          }, {
            desc: this.$t('选择[ERC20]后[保存二维码]并复制下方文字地址'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/4-3.png'),
          }, {
            title: this.$t('步骤2/2'),
            desc: _desc,
            imgUrl: _fourImgUrl,
          }, {
            desc: this.$t('提交您的取款申请'),
            imgUrl: _fiveImgUrl,
          }];
          break;
        case 4:
          _data = [{
            title: this.$t('步骤1/4'),
            desc: this.$t('点击首页左上方头像，在[我的]点击[收款方式]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/5-1.png'),
          }, {
            title: this.$t('步骤2/4'),
            desc: this.$t('添加[收款方式]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/5-2.png'),
          }, {
            title: this.$t('步骤3/4'),
            desc: this.$t('在[我要卖]中选择USDT后寻找商家[出售]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/5-3.png'),
          }, {
            title: this.$t('步骤4/4'),
            desc: this.$t('输入出售的数量并选择收款方式后[出售USDT]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/bnbDetail/5-4.png'),
          }];
          break;
        default:
          break;
      }
      return _data;
    },
    source() {
      return this.global.$store.state?.app?.source;
    },
  },
  mounted() {
    if (['10062', '10029', '10063', '10064'].includes(this.$projectname)) {
      this.menus.splice(3, 1);
    }
  },
  methods: {
    onTableChange() {
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      });
    },
  },
});
</script>

<style lang="less" scoped>
#welfare {
  background-color: #0D006E;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /deep/.nav-center span {
    color: #fff;
  }
  .content {
    width: 100%;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-size: cover;
    /deep/.van-tabs .van-tabs__nav .van-tab--active {
      color: #fff !important;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
    /deep/.van-tabs .van-tabs__nav .van-tab {
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #DCE0FF !important;
      margin-right: 30px;
    }
    /deep/.van-tabs .van-tabs__nav {
      background-color: #0D006E !important;
      padding-bottom: 0;
    }
    /deep/.van-tabs .van-tabs__wrap {
      z-index: 2;
      border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
      position: fixed;
      margin-top: 120px;
      left: 0;
      height: 91px;
      line-height: 91px;
      right: 0;
    }
    /deep/.van-tabs .van-tabs__nav .van-tab {
      height: 90px;
      line-height: 90px;
    }
    /deep/.van-tabs__line {
      height: 4px;
      width: 100px;
      background: #06D178 !important;
      bottom: 0px;
    }
     :deep(.van-tabs__content){
      padding-top: 230px;
    }
    .content-header {
      z-index: 1;
      background-color: #0D006E;
      position: fixed;
      left: 0;
      right: 0;
      color: #fff;
      padding: 40px 20px 40px 30px;
      span {
        display: inline-block;
        vertical-align: middle;
        margin-left: 20px;
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }
      img {
        vertical-align: middle;
        margin-top: -10px;
        width: 54px;
        height: 54px;
      }
      .header-icon {
        color: rgba(51, 51, 51, 0.6) !important;
        font-size:36px;
        position: absolute;
        right: 30px;
        top: 50%;
        margin-top: -18px;
      }
    }
    .tab-info {
      padding: 35px 25px 0;
      .info-header {
        padding-bottom: 40px;
        .info-header-title {
          text-align: center;
          font-size: 32px;
          line-height: 50px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
        }
        .info-header-desc {
          padding: 0 30px;
          margin-top: 25px;
          margin-bottom: 10px;
          text-align: left;
          font-size: 24px;
          line-height: 33px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #DCE0FF;
          position: relative;
          &::before {
            content: '';
            display: block;
            position: absolute;
            left: 10px;
            top: 10px;
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background-color: #06D178;;
          }
        }
      }
      .info-item {
        .item-img {
          width: 100%;
        }
        .item-title {
          text-align: center;
          font-size: 32px;
          line-height: 50px;
          font-family: "DIN Alternate", "PingFang SC", "Hiragino Sans GB", "Helvetica Neue", "Microsoft Yahei", sans-serif, arial;
          font-weight: 500;
          color: #FFFFFF;
        }
        .item-desc {
          margin-top: 10px;
          margin-bottom: 10px;
          padding: 0 30px;
          text-align: center;
          font-size: 24px;
          line-height: 32px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #DCE0FF;
        }
      }
    }
  }
  .no-header {
    padding-top: 0;
    margin-top:0;
  }
}

</style>
