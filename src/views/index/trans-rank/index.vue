<template>
  <div class="trans-rank-wrap">
    <van-nav-bar :title="$t('取款排行榜')" left-arrow @click-left="router.go(-1)" />
    <div class="rank-body">
      <ul class="rank-info">
        <li>
          <label>{{ info && info.withdraw_today_times }}</label>
          <span>{{ $t('今日取款笔数(笔)') }}</span>
        </li>
        <li>
          <label>{{ info && info.withdraw_times }}</label>
          <span>{{ $t('当前提款笔数(笔)') }}</span>
        </li>
        <li>
          <label>{{ info && info.time }}</label>
          <span>{{ $t('平均到账时间(分)') }}</span>
        </li>
      </ul>
      <div class="ranks">
        <ul>
          <li v-for="(item, index) in dataRanks" :key="index">
            <img :src="$getSrc(`/src/assets/images/ranks/rank${index + 1}.png`)" />
            <div class="name">{{ item.username.slice(-6) }}</div>
            <div class="money" v-money="item.money"></div>
          </li>
        </ul>
      </div>
      <div class="latest">
        <h2>{{ $t('最新动态') }}</h2>
        <div class="item" v-for="(item, index) in list" :key="index">
          <dl class="item-head">
            <SvgIcon name="withdraw-icon" />
            <dt>
              {{ item.username }}
              <!-- <van-image
                :src="$getSrc(`/src/assets/images/vip-level/lv-${item.level}@3x.png`)"
                fit="cover"
              />-->
              <SvgIcon class="rank-vip-item" :name="`login-vip-${item.level}`" />
            </dt>
            <dd v-money="item.money || 0.0"></dd>
          </dl>
          <dl class="item-body">
            <dt>{{ item.created_at }}</dt>
            <dd>
              <span class="processing green">{{ $t('出款成功') }}</span>
            </dd>
          </dl>
        </div>
      </div>
      <div class="float-button">
        <!-- <van-icon name="youzan-shield"/> -->
        <!-- <img :src="$getSrc('/src/assets/images/Shield@2x.png')" /> -->
        <SvgIcon name="shield" />
        <span>{{ $t('诚信经营') }}&nbsp;&nbsp;{{ $t('资金保障') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { withdrawlistinfo, withdrawtopinfo } from '@/api/center';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');

const dataRanks = ref([]);
const info = ref({});
const list = ref([]);
const router = useRouter();

useRequest(() => withdrawlistinfo(), {
  onSuccess(result) {
    info.value = result.info;
    list.value = result.list;
  },
});

useRequest(() => withdrawtopinfo(), {
  onSuccess(result) {
    dataRanks.value = result;
  },
});
</script>

<style lang="less">
.trans-rank-wrap {
  .wrap-money-decimal {
    font-size: 2.5vw !important;
  }
}
</style>

<style lang="less" scoped>
.trans-rank-wrap {
  :deep(.van-nav-bar__content) {
    color: var(--font-color-ffffff);
  }
  :deep(.van-nav-bar__title) {
    color: var(--font-color-ffffff);
  }
  background: var(--dark-bg-color-000, var(--bg-color-ffffff));
  display: flex;
  flex-direction: column;
  height: 100%;
}

.rank-body {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding-top: 14px;
  padding-bottom: 20px;
}

.rank-info {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  color: var(--font-color-fff);
  margin: 0 0 29px 0;
  > li {
    width: 33.3%;
    height: 140px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 16px;
    label {
      height: 70px;
      line-height: 70px;
      font-size: 60px;
      font-weight: 500;
      margin-bottom: 6px;
      color: var(--dark-fff, var(--font-color-333333));
    }
    span {
      height: 34px;
      line-height: 34px;
      opacity: 0.6;
      font-size: 24px;
      font-weight: 400;
      color: var(--dark-fff, var(--font-color-333333));
    }
  }

  em {
    font-size: 0.4em;
    margin-left: 10px;
    font-weight: normal;
    font-style: normal;
  }
}

.ranks {
  display: block;
  width: 100%;
  height: 313px;
  color: var(--dark-ffffff, var(--font-color-333333));

  ul {
    display: flex;
    width: 100%;
    height: 100%;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 24px;
    box-sizing: border-box;
  }

  li {
    position: relative;
    width: 226px;
    height: 286px;
    box-sizing: border-box;
    background: var(--dark-bg-color-191919, var(--bg-color-ffffff));
    border-radius: 14px;
    text-align: center;
    box-shadow: 0px 0px 14px 0px var(--dark-ranks-shadow, var(--ranks-shadow));
    color: var(--dark-fff, var(--font-color-333333));
    &:nth-child(n + 2) {
      height: 250px;
    }
    &:nth-child(1) {
      order: 2;
      padding-top: 187px;
    }
    &:nth-child(2) {
      order: 1;
      padding-top: 172px;
    }
    &:nth-child(3) {
      order: 3;
      padding-top: 172px;
    }
    > img {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 1;
    }
    .name,
    .money {
      position: relative;
      z-index: 2;
      height: 34px;
      line-height: 34px;
      font-size: 24px;
    }
    .name {
      margin-bottom: 6px;
    }
  }
}

.latest {
  margin-top: 56px;
  padding: 0 30px 100px;
  font-size: 24px;
  h2 {
    font-weight: 500;
    color: var(--dark-fff, var(--font-color-333333));
    font-size: 28px;
    height: 68px;
    line-height: 68px;
    margin: 0;
    border-bottom: 1px solid var(--border-color-51-01);
  }

  .item {
    border-bottom: 1px solid var(--border-color-51-01);
    height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .van-image {
      width: 44px;
      height: 44px;
      margin-left: 10px;
    }
  }
  dl {
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: var(--font-color-b1b1b1);
    padding-right: 30px;
    margin: 0;

    &.item-head {
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 8px;
      display: flex;
      align-items: center;

      .svg-icon-wrap {
        width: 40px;
        height: 40px;
      }

      dt {
        display: flex;
        font-size: 32.5px;
        align-items: center;
        color: var(--dark-fff, var(--font-color-000000));
        padding-left: 20px;
        .svg-icon-wrap {
          width: 80px;
          height: 26px;
          margin-left: 8px;
        }
      }
    }

    &.item-body {
      color: var(--dark-fff, var(--font-color-222930));

      .processing {
        .van-count-down {
          font-size: 16px;
        }

        &.green {
          color: var(--font-color-30ad8f);
        }
      }

      dt {
        opacity: 0.6;
        color: var(--dark-fff-06, var(--font-color-333333));
      }

      dd {
        color: var(--theme-color);
      }
    }

    dt {
      width: 55%;
      color: var(--dark-fff-06, var(--font-color-000000));
    }

    dd {
      width: 45%;
      text-align: right;
      color: var(--dark-fff, var(--font-color-000000));
    }
  }
}

.float-button {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  // width: 340px;
  height: 60px;
  opacity: 1;
  border-radius: 30px;
  line-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color-24c29a);
  color: var(--font-color-ffffff);
  text-align: center;
  font-size: 26px;
  padding: 0 20px;
  // .van-icon {
  //   font-size: 40px;
  //   margin-right: 12px;
  // }
  .shield {
    width: 28px;
    height: 36px;
    margin-right: 12px;
    fill: var(--theme-color);
  }
  span {
    white-space: nowrap;
  }
}
</style>
