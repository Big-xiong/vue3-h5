<template>
  <van-popup
    :show="show"
    :closeable="true"
    position="bottom"
    round
    lo
    @close="emit('update:show', false)"
    close-icon-position="top-right"
  >
    <div class="popup-title-wrap popup-choose-title-wrap">{{ title }}</div>
    <div :class="{ 'out-wrap': walletList.length > 1 }">
      <div class="choose" v-if="walletList.length">
        <div
          v-for="(item, index) in walletList"
          :key="index"
          :class="['father', { 'select': activeList.includes(index) && type === 1 }]"
        >
          <div
            class="layout-flex-between item"
            @click="chooseFather(item, index)"
            v-show="walletList.length > 1"
          >
            <p class="name" v-show="walletList.length > 1">
              {{ item.name }}(
              <template v-if="item.name === $t('中心钱包')">
                <i v-money="userWallet.money ?? 0"></i>
              </template>
              <template v-else>
                <i v-money="userWallet[`cate_${item.game_cate_id}_money`] ?? 0"></i>
              </template>
              )
            </p>
            <span @click.stop="trigerChooseFather(item, index)">
              <van-icon
                name="arrow"
                v-if="item.list_data"
                class="arrow_b"
                :class="{ active: activeList.includes(index) && type === 1 && showSon }"
              />
            </span>
            <!-- <img
              :src="$getSrc(`/src/assets/images/center/right.png`)"
              alt
              v-if="!item.list_data && activeChooseFrom === 0"
            />-->
            <van-icon alt name="success" v-if="!item.list_data && activeChooseFrom === 0" />
          </div>
          <div
            v-for="(val, ind) in item.list_data"
            :key="ind"
            :class="[
              'layout-flex-between',
              'son',
              { 'cate-son-wrap': type === 2 },
              { 'select': (activeChooseFrom === val.id && type === 1) || (activeChooseTo === val.id && type === 2) }
            ]"
            v-show="showSon && val.status === 1 && (activeList.includes(index) || walletList.length === 1)"
          >
            <p v-show="walletList.length > 1" @click.stop="chooseSon(val)" class="name">
              {{ val.name }}({{
                priceFormat(userWallet[`${val.money_code}`] ?? 0 ?? 0)
              }})
              <ShareIcon
                @click.stop="shareMoney(val.money_code)"
                :moneyCode="val.money_code"
                :shareWallet="shareWallet"
                v-if="val.isShare && shareWallet[val.money_code].length > 1"
              />
            </p>
            <p
              @click="chooseSon(val)"
              class="layout-flex-between name"
              v-show="walletList.length === 1"
            >
              <span>
                {{ val.name }}
                <ShareIcon
                  @click.stop="shareMoney(val.money_code)"
                  :moneyCode="val.money_code"
                  :shareWallet="shareWallet"
                  v-if="val.isShare && shareWallet[val.money_code].length > 1"
                />
              </span>
              <i v-money="userWallet[`${val.money_code}`] ?? 0"></i>
            </p>
            <!-- <img
              :src="$getSrc(`/src/assets/images/center/right.png`)"
              alt
              v-if="activeChooseFrom === val.id && type === 1"
            />-->
            <van-icon alt name="success" v-if="activeChooseFrom === val.id && type === 1" />
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import {
  inject, reactive, defineEmits, defineProps, watch, ref, onMounted, computed,
} from 'vue';
import { Toast } from 'vant';
import { priceFormat } from '@/utils/index';
import ShareIcon from './ShareIcon.vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  walletList: {
    type: Array,
    default: () => [],
  },
  show: {
    type: Boolean,
    default: false,
  },
  shareWallet: {
    type: Object,
    default: () => ({}),
  },
  userWallet: {
    type: Object,
    default: () => ({}),
  },
  type: {
    type: Number,
    default: null,
  },
});
const global = inject('global');
const store = inject('store');
const activeList = ref([0]);
const activeChooseFrom = ref(0);
const activeChooseTo = ref(0);
const { game } = store.state;
const emit = defineEmits([
  'update:show',
  'choosedFatherVal',
  'choosedChildVal',
]);
const showSon = ref(true);
function closeDialog() {
  emit('update:show', false);
}

watch(() => props.show, (val) => {
  if (!val) {
    showSon.value = true;
  }
});

function trigerChooseFather(item, index) {
  if (showSon.value) {
    showSon.value = !showSon.value;
    return;
  }
  chooseFather(item, index);
}

function chooseFather(item, index) {
  activeList.value = [index];
  let obj = {};
  if (index === 0) {
    activeChooseFrom.value = 0;
    obj = {
      from_platform_id: 0,
      from_platform_name: global.$t('中心钱包'),
      money: item.money || '0.00',
      from_money: 0,
      allMoney: props.userWallet.money,
    };
    emit('choosedFatherVal', obj);
    closeDialog();
  } else {
    showSon.value = true;
  }
}
function chooseSon(val) {
  let obj = {};
  if (props.type === 1) {
    activeChooseFrom.value = val.id;
    obj = {
      from_platform_id: val.id,
      from_platform_name: val.name,
      money: props.userWallet[val.money_code] || '0.00',
      from_money: val.money || '0.00',
      from_money_code: val.money_code,
      allMoney: props.userWallet[val.money_code] || '0.00',
    };
  } else {
    activeChooseTo.value = val.id;
    obj = {
      to_platform_id: val.id,
      to_platform_name: val.name,
      // money: props.userWallet[val.money_code] || '0.00',
      // allMoney: props.userWallet[val.money_code] || '0.00',
    };
  }
  emit('choosedFatherVal', obj);
  closeDialog();
}

function shareMoney(val) {
  Toast.success(`(${props.shareWallet[val].join('+')})余额共享`);
}

const title = computed(() => global.$t('转出钱包'),
  // if (props.walletList.length > 1) {
  //   return global.$t('转出钱包');
  // }

  // return props.walletList[0] ?? '';
);

</script>

<style lang="less" scoped>
.popup-title-wrap {
  width: 100%;
  color: var(--dark-fff, var(--font-color-f5f5f5));
  font-size: 32px;
  text-align: center;
  line-height: 100px;
  border-bottom: 0;
  background: transparent;
}

.choose {
  /* padding: 10px 30px 80px; */
  overflow: hidden;
  /* padding-left: 30px; */
  height: 800px;
  overflow-y: scroll;
  box-sizing: border-box;

  > .father {
    line-height: 98px;
    font-size: 32px;

    position: relative;

    &::after {
      content: "";
      position: absolute;
      left: 30px;
      right: 0;
      bottom: 0;
      border-bottom: 2px solid var(--dark-333, var(--border-color-e7e7e7));
    }
    &:last-child {
      &::after {
        border-bottom: none;
      }
    }
    > div {
      padding: 0 30px;
    }

    .son {
      padding-left: 70px;
      background-color: var(--bg-color-001e36);
      &.cate-son-wrap {
        padding: 0 30px;
      }
    }
    &.select {
      background-color: var(--theme-color);
      color: var(--font-color-ffffff);
      .son {
        padding-left: 40px;
        border: 0;
        .name {
          color: var(--font-color-ffffff) !important;
          // border: 0;
          .wrap-money {
            padding-right: 10px;
          }
        }
      }
      .item {
        border: 0;
      }
    }

    > .item {
      overflow: hidden;

      > .name {
        color: var(--dark-fff, var(--font-color-333333));
        margin: 0;
        font-weight: normal;

        span:last-child {
          color: var(--theme-color);
        }
      }

      > img {
        display: block;
        width: 28px;
      }

      > span {
        > .arrow_b {
          transform: rotate(90deg);
          transition: all 0.5s;
          color: var(--dark-fff, var(--font-color-666666));
          &.active {
            transform: rotate(-90deg);
          }
        }
      }
    }

    > .son {
      line-height: 100px;
      font-size: 32px;
      height: 100px;
      position: relative;
      display: flex;
      &.select {
        background-color: var(--theme-color);
        color: var(--font-color-ffffff);
        > .name {
          border: 0;
          span:last-child {
            color: var(--font-color-ffffff);
          }
          span:first-child {
            color: var(--font-color-ffffff);
          }
        }
        > img {
          display: block;
          width: 28px;
        }
      }

      p {
        margin: 0;
      }

      &.cate-son-wrap {
        .name {
          border-bottom: 2px solid var(--border-color-00001);
        }
      }

      > .name {
        color: var(--dark-fff, var(--font-color-333333));
        flex: 1;

        span:first-child {
          font-size: 28px;
          font-weight: normal;
        }
        span:last-child {
          font-size: 32px;
          font-weight: 600;
          color: var(--dark-fff, var(--font-color-333333));
        }
      }
    }
  }
}
</style>
