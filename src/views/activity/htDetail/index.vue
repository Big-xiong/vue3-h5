<template>
  <div id="welfare">
    <van-nav-bar
      :title="title"
      v-if="source !== 'app'"
      left-arrow
      @click-left="$router.go(-1)"
    ></van-nav-bar>
    <div
      class="content"
    >
      <div class="content-header">
        <img :src="$getSrc(`/src/assets/images/activity/zh-CN/htDetail/huobi-icon.png`)" alt="">
        <span>{{$t('火币')}}{{index}}</span>
        <van-icon class="header-icon" name="arrow" />
      </div>
      <van-tabs @change="onTableChange" style="color:#fff" :ellipsis="false" v-model:active="activeIndex">
          <van-tab :title="menu.title" v-for="menu in menus" :key="menu.id">
            <template v-if="menu.id === 0">
              <div class="tab-info">
                <div class="info-header">
                  <div class="info-header-title">注意事项</div>
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
      activeIndex: 0,
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
      switch (this.menus[this.activeIndex].id) {
        case 0:
          _data = [{
            title: this.$t('步骤1/9'),
            desc: this.$t('您可在此处下载币安App。安卓下载安装后可直接打开App注册，IOS请参考后面的步骤'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-1.png'),
          }, {
            title: this.$t('步骤2/9'),
            desc: this.$t('点击[IOS内测版]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-2.png'),
          }, {
            desc: this.$t('[点击下载TestFlight]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-3.png'),
          }, {
            desc: this.$t('点击[在App Store中查看]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-4.png'),
          }, {
            desc: this.$t('点击[获取]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-5.png'),
          }, {
            title: this.$t('步骤3/9'),
            desc: this.$t('TestFlight下载完毕后返回浏览器点击[开始测试]下载火币'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-6.png'),
          }, {
            desc: this.$t('在欢迎页面中点击[继续]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-7.png'),
          }, {
            title: this.$t('步骤4/9'),
            desc: this.$t('点击[安装]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-8.png'),
          }, {
            desc: this.$t('安装完毕后打开App点击[下一步]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-9.png'),
          }, {
            desc: this.$t('点击[开始测试]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-10.png'),
          }, {
            desc: this.$t('点击[同意]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-11.png'),
          }, {
            desc: this.$t('您可以选择[跳过]介绍页'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-12.png'),
          }, {
            title: this.$t('步骤5/9'),
            desc: this.$t('选择[我有经验]后[立即开启]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-13.png'),
          }, {
            title: this.$t('步骤6/9'),
            desc: this.$t('点击页面下方[注册]后可通过手机号进行注册'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-14.png'),
          }, {
            title: this.$t('步骤7/9'),
            desc: this.$t('注册后[设置密码]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-15.png'),
          }, {
            desc: this.$t('此时您已经拥有了火币账号并正处于登录状，点击左上角头像，开始认证。认证后方可进行交易'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-16.png'),
          }, {
            title: this.$t('步骤8/9'),
            desc: this.$t('点击账号右侧箭头进入[个人中心]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-17.png'),
          }, {
            title: this.$t('步骤9/9'),
            desc: this.$t('在[个人中心]点击[去认证]开始认证。建议完成高级认证'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/1-18.png'),
          }];
          break;
        case 1:
          const _imgUrl = this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/2-1.png');
          const _desc1_1_8 = this.$t(`打开${this.subConfig.title}[存款]选择[虚拟币充值]-[ERC20]并填写存入金额后点击[立即存款]`);
          // if (this.$projectname !== 'wanqu') {
          //   _imgUrl = this.$getSrc(`/src/assets/images/activity/zh-CN/htDetail/2-1-${this.$projectname}.png`);
          // }
          // if ( this.$projectname === '10062' ) {
          //   _imgUrl = this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/2-1-1.png');
          // }
          _data = [{
            title: this.$t('步骤1/8'),
            desc: _desc1_1_8,
            imgUrl: _imgUrl,
          }, {
            title: this.$t('步骤2/8'),
            desc: this.$t('将二维码页面截图保存至相册。二维码即平台的收款地址，28.944USDT代表您填写的人民币对应的USDT数量'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/2-2.png'),
          }, {
            title: this.$t('步骤3/8'),
            desc: this.$t('点击[快捷买币]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/2-3.png'),
          }, {
            title: this.$t('步骤4/8'),
            desc: this.$t('单笔购买大于20USDT可在[我要买]的[快捷区]中[按数量购买]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/2-4.png'),
          }, {
            desc: this.$t('若购买数量小于20USDT可在[自选区]中寻找[限额¥50.00]起售的商户[按数量购买]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/2-5.png'),
          }, {
            title: this.$t('步骤5/8'),
            desc: this.$t('输入购买数量后选择支付方式[确认购买]。购买数量=存款页面显示的转入USDT数+手续费'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/2-6.png'),
          }, {
            title: this.$t('步骤6/8'),
            desc: this.$t('[打开支付宝]向卖家的支付宝账号转账。若银行卡或微信则打开对应的软件操作。转账时建议不要备注任何信息'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/2-7.png'),
          }, {
            title: this.$t('步骤7/8'),
            desc: this.$t('转账成功后返回火币[确认]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/2-8.png'),
          }, {
            title: this.$t('步骤8/8'),
            desc: this.$t('等待卖家确认'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/2-9.png'),
          }, {
            desc: this.$t('卖家确认后可[查看资产]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/2-10.png'),
          }];
          break;
        case 2:
          _data = [{
            title: this.$t('步骤1/3'),
            desc: this.$t('待购买的USDT到账后在[资产]中点击[提币]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/3-1.png'),
          }, {
            title: this.$t('步骤2/3'),
            desc: this.$t('搜索[USDT]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/3-2.png'),
          }, {
            title: this.$t('步骤3/3'),
            desc: this.$t('选择[ERC20]后使用扫码功能扫描刚刚保存在相册中的二维码并输入转账[数量]后点击[提币]。数量=存款页面显示的转入USDT数+手续费'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/3-3.png'),
          }];
          break;
        case 3:
          let _fourImgUrl = this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/4-4.png');
          let _fiveImgUrl = this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/4-5.png');
          const _desc3_2_2 = this.$t(`将您的币安收款地址与${this.subConfig.title}账户绑定`);
          if (this.$projectname === '10029') {
            _fourImgUrl = this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/4-4-0.png');
            _fiveImgUrl = this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/4-5-0.png');
          }
          _data = [{
            title: this.$t('步骤1/2'),
            desc: this.$t('在[资产]中点击[充币]'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/4-1.png'),
          }, {
            desc: this.$t('搜索[USDT]并选中'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/4-2.png'),
          }, {
            desc: this.$t('选择[ERC20]后[保存二维码]并复制下方文字地址'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/4-3.png'),
          }, {
            title: this.$t('步骤2/2'),
            desc: _desc3_2_2,
            imgUrl: _fourImgUrl,
          }, {
            desc: this.$t('提交您的取款申请'),
            imgUrl: _fiveImgUrl,
          }];
          break;
        case 4:
          _data = [{
            title: this.$t('步骤1/4'),
            desc: this.$t('在[首页]中点击左上角头像'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/5-1.png'),
          }, {
            title: this.$t('步骤2/4'),
            desc: this.$t('在边栏中进入账户中心'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/5-2.png'),
          }, {
            title: this.$t('步骤3/4'),
            desc: this.$t('点击[收款方式管理]后添加收款方式'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/5-3.png'),
          }, {
            title: this.$t('步骤4/4'),
            desc: this.$t('在卖币页面选择商家输入想要售出的金额后下单'),
            imgUrl: this.$getSrc('/src/assets/images/activity/zh-CN/htDetail/5-4.png'),
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
    :deep(.van-tabs__content){
      padding-top: 230px;
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
        width: 32px;
        height: 54px;
      }
      .header-icon {
        font-size:36px;
        position: absolute;
        color: rgba(51, 51, 51, 0.6) !important;
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
