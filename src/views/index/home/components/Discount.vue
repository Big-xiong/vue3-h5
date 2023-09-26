<template>
  <div
    class="discount-wrap"
    v-show="discountData?.length"
  >
    <div class="discount-title">
      <span class="left-wrap">
        <SvgIcon name="coupon" />
        {{ $t('优惠') }}
      </span>
      <div class="more-wrap">
        <span @click="$router.push('/promos')">{{ $t('查看全部') }}</span>
        <van-icon name="arrow"></van-icon>
      </div>
    </div>
    <div class="discount-box-wrap no-scrollbar">
      <div
        class="box"
        v-for="item in discountData"
        :key="item.id"
      >
        <div class="box-discount">
          <SvgIcon
            name="discount-bg"
            class="bg-svg"
          />
          <div class="info">
            <!--            <img :src="$getSrc(`/src/assets/images/home/bli.png`)" />-->
            <SvgIcon name="stamp" />
            <div class="info-right">
              <div class="info-right-title text-ellipsis">{{ item.name }}</div>
              <div class="flex">
                <span
                  class="sub-title"
                  v-if="item.acitivity_type"
                >{{ item.acitivity_type }}</span>
                <span class="time-wrap">
                  <van-icon name="underway-o" />
                  <em v-if="item.end_time">{{ item.end_time }}</em>
                  <em v-else>
                    <span>{{ $t('长期活动') }}</span>
                  </em>
                </span>
              </div>
            </div>
          </div>
          <div class="line"></div>
          <div class="box-discount-btn">
            <div
              class="layout-flex-center"
              @click="handleSign(item)"
            >{{ signedText[item.signed_option] }}</div>
            <div
              class="layout-flex-center active"
              v-login="() => handleUnSign(item)"
            >{{ $t('更多详情') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- @click="global.$popup({ tpl: 'DiscountDetail', id: item.id })" -->

<script setup>
import { inject, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import dayjs from 'dayjs';
import { Toast } from 'vant';
import { useDiscount } from '@/utils/hooks.js';
import { allbenefit, getactivityaward } from '@/api/active';
import SvgIcon from '@/components/SvgIcon.vue';

const {
  run,
  data: discountData,
  loading,
} = useRequest(
  () => allbenefit(),
  {
    formatResult(res) {
      return res.data.slice(0, 10);
    },
  },
);

const global = inject('global');
const store = inject('store');
const { isLogin } = store.state.user;

function getTime(date) {
  return dayjs(date) - dayjs(Date.now());
}

const {
  signedText,
  handleSign,
  handleUnSign,
} = useDiscount();

</script>

<style lang="less" scoped>
.discount-wrap {
  margin-top: 56px;

  .discount-box-wrap {
    display: flex;
    margin-bottom: 30px;
    padding-left: 32px;
    overflow-x: auto;
  }

  .discount-title {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    box-sizing: border-box;
    padding: 0 32px;
    margin-bottom: 40px;

    .left-wrap {
      align-items: center;
      display: flex;
      font-size: 36px;
      font-weight: 400;
      color: var(--dark-fff, var(--font-color-404040));

      .svg-icon-wrap {
        width: 38px;
        height: 34px;
        margin-right: 14px;
      }
    }

    .more-wrap {
      display: flex;
      align-items: center;
      color: var(--theme-color);
      font-size: 28px;
      font-weight: 500;

      .van-icon {
        font-size: 20px;
        color: var(--theme-color);
      }
    }
  }

  .box {
    position: relative;
    border-radius: 8px;
    margin-right: 20px;
    width: 600px;

    &-discount {
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 184px;
      position: relative;

      .bg-svg {
        position: absolute;
        width: 100%;
        height: 184px;
      }

      &-btn {
        position: relative;
        z-index: 2;
        display: flex;
        margin: 20px auto 0 auto;
        padding-left: 32px;

        div {
          width: 248px;
          box-sizing: border-box;
          height: 40px;
          font-size: 24px;
          border: 2px solid var(--border-color-fff);
          border-radius: 6px;
          color: var(--font-color-ffffff);
        }

        div:nth-child(1) {
          margin-right: 18px;
        }

        .active {
          background-color: var(--bg-color-24c29a);
          border: none;
        }
      }

      .line {
        width: 540px;
        height: 2px;
        margin: 0 auto;
        background-image: url('/src/assets/images/discount-line.svg');
        position: relative;
        z-index: 2;
      }

      .info {
        display: flex;
        align-items: center;
        color: var(--font-color-ffffff);
        box-sizing: border-box;
        padding: 16px 0 16px 32px;
        position: relative;
        z-index: 2;

        &-right {
          margin-left: 18px;
          display: block;
          display: flex;
          flex-direction: column;
          justify-content: center;

          &-title {
            font-size: 32px;
            font-weight: 600;
            line-height: 34px;
            width: 470px;
          }

          .flex {
            display: flex;
            align-items: center;
            white-space: nowrap;

            .sub-title {
              margin-right: 30px;
              font-size: 24px;
              max-width: 190px;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            .time-wrap {
              font-size: 20px;
              display: flex;
              align-items: baseline;
              color: var(--font-color-ffffff);

              :deep(.van-count-down) {
                height: 20px;
                line-height: 20px;
                color: var(--font-color-ffffff);
                font-size: 20px;
                font-weight: normal;
              }

              .van-icon {
                position: relative;
                width: 24px;
                height: 24px;
                line-height: 24px;
                font-size: 20px;
                margin-right: 4px;
              }
            }

            em {
              font-style: normal;
            }
          }
        }

        .svg-icon-wrap {
          width: 72px;
          height: 72px;
        }
      }
    }

    img {
      width: 240px;
      height: 242px;
    }

    .name {
      font-size: 24px;
      font-weight: 500;
      color: var(--font-color-ffffff);
      line-height: 34px;
      display: block;
      position: absolute;
      top: 200px;
      left: 20px;
    }
  }
}
</style>
