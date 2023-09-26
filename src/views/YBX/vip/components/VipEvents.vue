<template>
  <div class="vip-page">
    <van-tabs
      @click="tabClick"
    >
      <van-tab
        v-for="(item, index) in tags"
        :key="index"
        title-active-color="var(--cur-color-333333)"
      >
        <template #title>
          <van-image
            class="tab-icon-nor"
            :src="$getSrc(`/src/assets/images/vip/vip_details_icon${index + 1}_normal@2x.png`)"
          />
          <van-image
            class="tab-icon-active"
            :src="$getSrc(`/src/assets/images/vip/vip_details_icon${index + 1}_Select@2x.png`)"
          />
          <span>{{$t(item.title)}}</span>
        </template>
      </van-tab>
    </van-tabs>
    <div
      class="container"
    >
      <template v-if="activeNum === 0">
        <div class="main-block">
          <p class="block-tit">
            <b class="venueStyle__linemark"></b><i>{{$t('场馆返水')}}</i
            ><i>{{$t('VIP等级越高，返水越高')}}</i>
          </p>
          <p class="block-tit-sub">{{$t('特权简介')}}</p>
          <p class="block-desc">
            会员达到指定VIP等级,即可获得返水福利,VIP等级越高,返水越高！
          </p>
          <div class="venueStyle__tab">
            <div class="venueStyle__wbTable">
              <ul class="venueStyle__content" v-if="benefitData?.length">
                <li class="venueStyle__content_tit">
                  <div>{{$t('场馆')}}</div>
                  <div v-for="(item, index) in benefitData?.length && benefitData[0]?.list" :key="index">VIP{{item.level}}</div>
                </li>
                <li>
                  <!--<template v-for="(item,index) in benefitData">-->
                  <div
                    class="venueStyle__venuename_wrap"
                  >
                    <ul
                      class="venueStyle__venuename"
                      v-for="(item, index) in benefitData"
                      v-show="item.name != '六合彩'"
                      :key="index"
                    >
                      <li>{{ item.name }}</li>
                      <li v-for="child in item.list" :key="child">
                        {{ child.proportion }}%
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="venueStyle__tips">
            *以上为各场馆最高返水，具体返水金额请以实际游戏为准。
          </div>
        </div>
      </template>
      <template v-if="activeNum === 1">
        <div class="main-block">
          <p class="block-tit">
            <b class="venueStyle__linemark"></b><i>{{$t('每日提款')}}</i
            ><i>{{$t('VIP等级越高，每日提款次数和金额越多')}}</i>
          </p>
          <p class="block-tit-sub">{{$t('特权简介')}}</p>
          <p class="block-desc">
            会员VIP等级不同，每日可提款的次数和可提款的金额不同，VIP等
            级越高，每日可提款次数越多，每日可提款金额越高！
          </p>
          <table class="venueStyle__monthlyTable">
            <colgroup>
              <col width="20%" />
              <col width="40%" />
              <col width="40%" />
            </colgroup>
            <tbody>
              <tr>
                <th colspan="3">{{$t('VIP每日提款')}}</th>
              </tr>
              <tr>
                <td>{{$t('VIP等级')}}</td>
                <td>{{$t('日提款次数')}}</td>
                <td>{{$t('日提款额度')}}</td>
              </tr>
              <tr v-for="(item, index) in dicts?.memberlevellist" :key="index">
                <td>VIP{{ item.level }}</td>
                <td>{{ item.withdraw_times_limit }}</td>
                <td>{{ item.withdraw_money_limit }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-if="activeNum === 2">
        <div class="main-block">
          <p class="block-tit">
            <b class="venueStyle__linemark"></b><i>{{$t('佳节礼品')}}</i
            ><i>{{$t('VIP等级越高，佳节礼品金额越多')}}</i>
          </p>
          <p class="block-tit-sub">{{$t('特权简介')}}</p>
          <p class="block-desc">
            {{$t(`达到一定VIP等级时您可以在中国法定节假日联系在线客服小姐姐，领取对应等级礼品哦！`)}}
          </p>
          <table class="venueStyle__monthlyTable">
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>
            <tbody>
              <tr>
                <th colspan="2">{{$t('VIP佳节礼品')}}</th>
              </tr>
              <tr>
                <td>{{$t('VIP等级')}}</td>
                <td>{{$t('佳节礼品')}}</td>
              </tr>
              <tr v-for="(item, index) in farewareData"  :key="index">
                <td>VIP{{ item.level }}</td>
                <td>{{ item.gift ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
          <div class="venueStyle__tips">
            *礼包内容可能不定期更新，具体以领取时的提示为准。
          </div>
        </div>
      </template>
      <template v-if="activeNum === 3">
        <div class="main-block">
          <p class="block-tit">
            <b class="venueStyle__linemark"></b><i>{{$t('生日礼金')}}</i
            ><i>{{$t('VIP等级越高，生日礼金金额越多')}}</i>
          </p>
          <p class="block-tit-sub">{{$t('特权简介')}}</p>
          <p class="block-desc">
            {{$t(`达到一定VIP等级的时候，平台将会在您生日的时候赠送大额的生
            日礼金，一定要记得设置生日哦！ 特别说明:会员在注册90天内过
            生日，今年将不能领取生日礼金。另注册时间大于90天的会员需在
            生日当天的VIP页面进行自助领取，每年可领取一次。（生日彩金
            1倍流水即可提款）`)}}
          </p>
          <table class="venueStyle__monthlyTable">
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>
            <tbody>
              <tr>
                <th colspan="2">{{$t('VIP生日礼金')}}</th>
              </tr>
              <tr>
                <td>{{$t('VIP等级')}}</td>
                <td>{{$t('生日礼金')}}</td>
              </tr>
              <tr v-for="(item, index) in farewareData" :key="index">
                <td>VIP{{ item.level }}</td>
                <td>{{ item.birthday_money ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
          <div class="venueStyle__tips">
            *{{$t(`礼包内容可能不定期更新，具体以领取时的提示为准。`)}}
          </div>
        </div>
      </template>
      <template v-if="activeNum === 4">
        <div class="main-block">
          <p class="block-tit">
            <b class="venueStyle__linemark"></b><i>{{$t('晋级礼金')}}</i
            ><i>{{$t('VIP等级越高，晋级礼金金额越多')}}</i>
          </p>
          <p class="block-tit-sub">{{$t('特权简介')}}</p>
          <p class="block-desc">
            {{$t(`会员晋级的时候，自动获得晋级礼金，VIP等级越高，晋级的时候
            获得的VIP晋级礼金也越多！每个玩家每个VIP等级只能获得1次晋
            级礼金。VIP等级降级后，再次晋级，不能重复获得晋级礼金。`)}}
          </p>
          <table class="venueStyle__monthlyTable">
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>
            <tbody>
              <tr>
                <th colspan="2">{{$t('VIP晋级礼金')}}</th>
              </tr>
              <tr>
                <td>{{$t('VIP等级')}}</td>
                <td>{{$t('晋级礼金')}}</td>
              </tr>
              <tr v-for="(item, index) in farewareData" :key="index">
                <td>VIP{{ item.level }}</td>
                <td>{{ item.upgrade_money ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
          <div class="venueStyle__tips">
            *{{$t(`礼包内容可能不定期更新，具体以领取时的提示为准。`)}}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import {
  ref, inject,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute } from 'vue-router';
import { Swiper } from 'vue-awesome-swiper';

import {
  privilegeactivity,
  allactivitybenefit,
} from '@/api/vip';
import 'swiper/dist/css/swiper.css';

const global = inject('global');
const store = inject('store');
const { app: { dicts } } = store.state;

store.dispatch('app/getDict', ['memberlevellist']);

const route = useRoute();

const tags = [
    {
      title: global.$t('场馆返水'),
      normIcon: '',
      activeIcon: '',
    },
    {
      title: global.$t('每日提款'),
      normIcon: '',
      activeIcon: '',
    },
    {
      title: global.$t('佳节礼品'),
      normIcon: '',
      activeIcon: '',
    },
    {
      title: global.$t('生日礼金'),
      normIcon: '',
      activeIcon: '',
    },
    {
      title: global.$t('晋级礼金'),
      normIcon: '',
      activeIcon: '',
    },
  ];
  const activeNum = ref(0);
  const farewareData = ref([]);

const { data: benefitData } = useRequest(allactivitybenefit);
const { loading: farewareDataLoading } = useRequest(privilegeactivity, {
  onSuccess(res) {
    farewareData.value = res.benefit_setting;
  },
});
function tabClick(name) {
  activeNum.value = name;
}
</script>

<style lang="less" scoped>

.vip-page {
  overflow: auto;
 :deep(.van-tabs) {
    position: fixed;
    width: 100%;
    left: 0;
    z-index: 1;
    height: 96px;
    top: 0;
    background: var(--bg-color-white);
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.06);

    .van-tabs__wrap {
      height: 100%;
      border-bottom: 0 !important;
    }

    .van-tabs__nav {
      height: 100%;
    }

    .van-tabs__line {
      display: none;
    }

    .van-tab__text {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .van-image {
        width: 44px;
        height: 44px;
      }

      span {
        line-height: 1;
        font-size: 22px;
        color: var(--cur-color-bbb);
        margin-top: 8px;
      }
    }

    .van-tab--active {
      .van-tab__text span {
        color: var(--cur-color-333333);
      }
    }

    .van-tab .tab-icon-active {
      display: none;
    }

    .van-tab .tab-icon-nor {
      display: block;
    }

    .van-tab--active .tab-icon-nor {
      display: none;
    }

    .van-tab--active .tab-icon-active {
      display: block;
    }
  }

  .container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    z-index: 0;
    padding: 120px 30px 50px;
    background: #f5f6fa;
    box-sizing: border-box;

    .main-block {
      background: var(--bg-color-white);
      box-shadow: 0px 6px 30px 0px rgba(0, 34, 80, 0.1);
      border-radius: 20px;
      padding: 20px;

      .block-tit {
        display: flex;
        align-items: center;

        b {
          width: 6px;
          height: 32px;
          background: var(--btn-gradient-color);
          border-radius: 3px;
        }

        i:nth-child(2) {
          font-size: 28px;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
          margin: 0 24px 0 14px;
        }

        i:nth-child(3) {
          font-size: 20px;
          color: var(--cur-color-999);
        }
      }

      .block-tit-sub {
        font-size: 20px;
        color: var(--cur-color-333333);
        margin: 22px 0 14px;
        margin-left: 20px;
      }

      .block-desc {
        padding: 0 20px;
        font-size: 20px;
        color: var(--cur-color-999);
        line-height: 32px;
      }

      .venueStyle__tab {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        margin-top: 16.5px;
        width: 100%;
        text-align: center;
      }

      .venueStyle__tab .venueStyle__wbTable {
        width: 100%;
      }

      .venueStyle__tab .venueStyle__wbTable .venueStyle__content {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        width: 100%;
        // border-left: 1px solid var(--border-color-ececec);
        margin-left: 16.5px;
        font-size: 24px;
      }

      .venueStyle__content_tit::after {
        content: "";
        position: absolute;
        display: block;
        right: -3.2px;
        right: -16.5px;
        top: 0;
        width: 3.2px;
        width: 16.5px;
        height: 100%;
        background: -webkit-gradient(
          linear,
          left top,
          right top,
          from(rgba(0, 0, 0, 0.05)),
          to(transparent)
        );
        background: -webkit-linear-gradient(
          left,
          rgba(0, 0, 0, 0.05),
          transparent
        );
        background: linear-gradient(to right, rgba(0, 0, 0, 0.05), transparent);
        z-index: 2;
      }

      .venueStyle__tab .venueStyle__wbTable .venueStyle__content li {
        border: 1px solid var(--border-color-ececec);
        border-left: 0;
        position: relative;
      }

      .venueStyle__tab
        .venueStyle__wbTable
        .venueStyle__content
        li:first-child {
        width: 86px;
        border-left: 1px solid var(--border-color-ececec);
      }

      .venueStyle__tab
        .venueStyle__wbTable
        .venueStyle__content
        li:first-child
        div {
        border-bottom: 1px solid var(--border-color-ececec);
        height: 84px;
        line-height: 84px;
        font-weight: 600;
      }

      .venueStyle__tab
        .venueStyle__wbTable
        .venueStyle__content
        li:first-child
        div:first-child {
        height: 58px;
        line-height: 58px;
        padding: 0;
        background-color: #edeff6;
      }

      .venueStyle__tab
        .venueStyle__wbTable
        .venueStyle__content
        li:first-child
        div:last-child {
        border: 0;
      }

      .venueStyle__tab .venueStyle__wbTable .venueStyle__content li:last-child {
        width: 86%;
        overflow-y: hidden;
        border-right: 0;
        -webkit-overflow-scrolling: touch;
      }

      .venueStyle__venuename_wrap {
        display: flex;
        .venueStyle__venuename:first-child li:first-child{
          border-left: 0 !important;
        }
      }

      .venueStyle__tab .venueStyle__wbTable .venueStyle__content li ul {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        flex-direction: column;
        background: #fff;
        width: 150px;
      }

      .venueStyle__tab .venueStyle__wbTable .venueStyle__content li ul > li {
        border: 0;
        height: 84px;
        line-height: 84px;
        width: 150px;
        color: var(--theme-color);
        text-align: center;
        border-bottom: 1px solid var(--border-color-ececec);
        border-right: 1px solid var(--border-color-ececec);

        &:first-child {
          height: 58px;
          line-height: 58px;
          background-color: #edeff6;
          color: var(--cur-color-333333);
        }
      }

      .venueStyle__tab .venueStyle__wbTable .venueStyle__content li ul > li p {
        margin: 0;
        padding: 0;
      }

      .venueStyle__tab
        .venueStyle__wbTable
        .venueStyle__content
        li
        ul
        > li:first-child {
        width: 150px;
      }

      .venueStyle__tab
        .venueStyle__wbTable
        .venueStyle__content
        li
        ul
        > li:last-child {
        width: 150px;
        border-right: 1px solid var(--border-color-ececec);
      }

      .venueStyle__tab
        .venueStyle__wbTable
        .venueStyle__content
        li
        ul.venueStyle__venuename__mMwO6
        li {
        color: var(--cur-color-333333);
      }

      .venueStyle__monthlyTable {
        width: 100%;
        border-collapse: collapse;
        margin-top: 24px;
        font-size: 24px;
      }

      .venueStyle__monthlyTable td {
        width: 87.5px;
        border: 0.0150px var(--border-color-ececec) solid;
        text-align: center;
        height: 66px;
        color: var(--cur-color-333333);
      }

      .venueStyle__monthlyTable th {
        background: #edeff6;
        border: 0.0150px var(--border-color-ececec) solid;
        text-align: center;
        height: 66px;
        color: var(--cur-color-333333);
        font-weight: bold;
      }

      .venueStyle__tab .venueStyle__left {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .venueStyle__tab .venueStyle__left .venueStyle__vip {
        border-collapse: collapse;
        height: 213px;
      }

      .venueStyle__tab .venueStyle__left .venueStyle__vip td {
        width: 87.5px;
        border: 0.0150px var(--border-color-ececec) solid;
        border-bottom: 0;
        color: #158bf4;
      }

      .venueStyle__tab .venueStyle__left .venueStyle__tableleft {
        border-collapse: collapse;
      }

      .venueStyle__tab .venueStyle__left .venueStyle__tableleft td {
        width: 87.5px;
        height: 52.5px;
        color: #158bf4;
        border: 0.0150px var(--border-color-ececec) solid;
      }

      .venueStyle__venuename {
        color: var(--cur-color-333333);
        width: 136px;
      }

      .venueStyle__tips {
        color: #e02020;
        margin-top: 12px;
        font-size: 24px;
      }
    }
  }
  .back-top {
    width: 200px;
    height: 80px;
    display: block;
    position: fixed;
    bottom: 50px;
    left: 50%;
    margin-left: -100px;
  }
}
.more-padding-bottom {
  padding-bottom: 120px;
}
</style>
