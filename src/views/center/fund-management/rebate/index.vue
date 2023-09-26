<template>
  <div class="rebate-wrap">
    <van-nav-bar
      class="m-header"
      :title="$t('自助洗码')"
      left-arrow
      :right-text="$t('历史记录')"
      @click-left="$router.go(-1)"
      @click-right="$router.push({ name: 'centerHistory' })"
    ></van-nav-bar>
    <div class="rebate-wrap-main">
      <template v-if="dataObj.recordList.length">
        <div class="wash-money">
          <div class="money">
            <p v-money="dataObj.totalMoney || 0"></p>
            <p @click="showMsg" class="canWash">
              <span>{{ $t('可洗码金额') }}</span>
              <SvgIcon name="help" />
            </p>
          </div>
          <van-button
            type="primary"
            :loading="loading"
            class="btn-wash"
            @click="doRebate"
          >{{ $t('一键洗码') }}</van-button>
        </div>
        <div class="list" v-if="dataObj.recordList.length">
          <div class="detail">
            <div class="wash" v-for="(item, index) in dataObj.recordList" :key="index">
              <div class="wash-left">
                <div>
                  <p>{{ $t('类型') }}</p>
                  <p>{{ platforms[item.game_cate_id] }}-{{ dicts?.allplatform[item.game_platform_id] ?? '' }}</p>
                </div>
                <div>
                  <p>{{ $t('投注') }}</p>
                  <p v-money="item.today_valid_bet"></p>
                </div>
                <div>
                  <p>{{ $t('洗码比例') }}</p>
                  <p>{{ (item.rate * 100).toFixed(2) }}%</p>
                </div>
                <div>
                  <p>{{ $t('未结算') }}</p>
                  <p v-money="item.no_settle_valid_bet"></p>
                </div>
              </div>
              <div class="wash-right">
                <div>
                  <p>{{ $t('可洗码') }}</p>
                  <p class="primary-color" v-money="item.promotion_money"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="layout-flex-center empty" v-if="dataObj.noData">
        <!-- <img
          :src="$getSrc(`/src/assets/images/center/wuxim@2x.png`)"
          alt
        />-->
        <svg-icon name="xima" />
        <div class="text">
          {{ $t('尊敬的用户') }}
          <br />
          {{ $t('当前由于您尚未达到任何游戏种类的洗码结算要求，暂时无法为您洗码，多多游戏才能多多洗码哦~') }}
        </div>
      </div>
    </div>
    <!-- <teleport to="#app" v-if="dicts?.siteinfo?.auto_wash === 1">
          <div class="rebate-wrap-footer-tips">
            <p>{{ $t("温馨提示：系统每天16点自动结算") }}</p>
          </div>
    </teleport>-->
  </div>
</template>

<script setup>
import {
  inject, reactive, watch, defineProps,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast, Dialog } from 'vant';
import { washcodelist, dowashcode, allgamecate } from '@/api/center';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const $store = inject('store');
$store.dispatch('app/getDict', ['siteinfo', 'allplatform']);
const { dicts } = $store.state.app;
const dataObj = reactive({
  startTime: '',
  endTime: '',
  noData: false,
  recordList: [],
  columns: [],
  total: 0,
  current: 1,
  totalMoney: '0.00',
});
const { data: platforms } = useRequest(allgamecate);
const { run: recordRun, loading: recordLoading } = useRequest(() => washcodelist({ LOADING: true, page: dataObj.current }), {
  manual: false,
  onSuccess: (res, params) => {
    dataObj.recordList = res.list;
    dataObj.totalMoney = res.total_money;
    dataObj.noData = !res.list.length;
  },
});

// 洗码
const { run: doRecordRun, loading: oRecordLoading } = useRequest(dowashcode, {
  manual: true,
  onSuccess: (res, params) => {
    // global.$popup({
    //   tpl: 'WashcodeSuccess',
    //   money: dataObj.totalMoney,
    // });
    Toast.success(global.$t('洗码成功'));
    recordRun();
  },
});

function doRebate() {
  doRecordRun();
}

function showMsg() {
  global.$dialog({ tpl: 'AgentTips', message: global.$t('产生有效投注额将可以按照您星级洗码比例赠送红利') });
}
</script>

<style lang="less" scoped>
.rebate-wrap {
  overflow-x: hidden;
  p {
    margin: 0;
  }

  &-main {
    .wash-money {
      padding-top: 40px;
      padding-bottom: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));

      .money {
        > p:first-child {
          height: 84px;
          line-height: 84px;
          font-size: 60px;
          color: var(--dark-fff, var(--font-color-000));
          text-align: center;
        }

        > p:last-child {
          position: relative;
          top: -5px;
          height: 44px;
          line-height: 44px;
          font-size: 24px;
          color: var(--dark-fff, var(--font-color-333333));
          margin: 0 0 37px;
          display: flex;
          align-items: center;

          > span {
            opacity: 0.6;
          }

          .svg-icon-wrap {
            fill: var(--theme-color);
            width: 44px;
            height: 44px;
          }
        }
      }

      .btn-wash {
        width: 320px;
        height: 88px;
        text-align: center;
        background: var(--theme-color);
        border-radius: 44px;
        font-size: 32px;
      }
    }

    .list {
      padding-left: 28px;

      .detail {
        color: var(--font-color-b1b1b1);

        .wash {
          border-bottom: 2px solid rgba(255, 255, 255, 0.06);
          padding: 30px 0 10px;
          margin-bottom: 36px;
          &:after {
            content: "";
            display: block;
            clear: both;
          }
          > div {
            float: left;
            text-align: left;
            > div {
              float: left;
              color: var(--dark-fff, var(--font-color-333333));
              &:after {
                content: "";
                display: block;
                clear: both;
              }
              > p:first-child {
                height: 40px;
                line-height: 40px;
                font-size: 28px;
                opacity: 0.6;
                margin-bottom: 6px;
              }
              > p:last-child {
                height: 44px;
                line-height: 44px;
                font-size: 32px;
              }
              margin-bottom: 20px;
            }
            > div:nth-child(odd) {
              width: 251px;
            }
            > div:nth-child(even) {
              width: 261px;
            }
          }
          .wash-left {
            width: 512px;
          }
          .wash-right {
            width: 208px;
            > div:nth-child(odd) {
              position: relative;
              width: 100%;
              padding-left: 32px;
              > p:last-child {
                color: var(--theme-color);
              }
              &:after {
                content: "";
                position: absolute;
                top: 8px;
                left: 0;
                width: 2px;
                height: 78px;
                background: var(--bg-color-000000);
                opacity: 0.1;
              }
            }
          }

          // p {
          //   line-height: 50px;
          //   font-size: 32px;
          // }

          // .wash-top {
          //   display: flex;

          //   div {
          //     flex: 1;

          //     &.flex2 {
          //       flex: 2;
          //       margin-right: 30px;
          //       border-right: 2px solid rgba(255, 255, 255, 0.06);
          //     }

          //     p:nth-child(1) {
          //       color: var(--dark-fff, var(--font-color-222930));
          //     }

          //     p:nth-child(2) {
          //       color: var(--font-color-b1b1b1);
          //     }

          //     .primary-color {
          //       color: var(--theme-color) !important;
          //     }
          //   }
          // }

          // .wash-bottom {
          //   display: flex;

          //   div {
          //     flex: 1;

          //     &.flex2 {
          //       flex: 2;
          //     }

          //     p:nth-child(1) {
          //       color: var(--dark-fff, var(--font-color-222930));
          //     }

          //     p:nth-child(2) {
          //       color: var(--font-color-b1b1b1);
          //     }
          //   }
          // }
        }
      }
    }

    .empty {
      position: absolute;
      top: 0;
      width: 100%;
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 0 55px;
      box-sizing: border-box;

      .svg-icon-wrap {
        width: 108px;
        height: 108px;
      }

      .text {
        text-align: center;
        margin-top: 60px;
        font-size: 28px;
        color: var(--dark-fff, var(--font-color-515104));
        line-height: 48px;
      }
    }
  }
}

:deep(.van-nav-bar__right) {
  span {
    color: var(--dark-fff);
  }
}
:deep(.van-nav-bar__title) {
  color: var(--font-color-ffffff);
}
:deep(.van-nav-bar__left) {
  color: var(--font-color-ffffff);
}
:deep(.van-nav-bar__right) {
  color: var(--font-color-ffffff);
}
</style>
