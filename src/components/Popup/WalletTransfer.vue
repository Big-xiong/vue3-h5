<template>
  <Popup
    class="wallet-transfer-wrap"
    :showCancelBtn="true"
    :show="isShow"
    @close="emit('close')"
    :title="title"
  >
    <div class="wallet-transfer-body">
      <div
        v-for="(item, index) in walletList"
        :key="index"
        :class="['father', { 'select': activeList.includes(index) }]"
      >
        <div class="item" @click="chooseFather(item, index)">
          <p class="name">
            {{ item.game_platform_name }}(
            <template v-if="item.game_platform_name === $t('中心钱包')">
              <span v-money="item.money ?? 0"></span>
            </template>
            <template v-else>
              <span v-money="walletInfo[`cate_${item.game_cate_id}_money`] ?? 0"></span>
            </template>
            )
          </p>
          <span @click.stop="trigerChooseFather(item, index)">
            <van-icon
              alt
              name="arrow-down"
              class="arrow_b"
              v-if="item.platform_list?.length"
              :class="{ active: activeList.includes(index) && showSon }"
            />
          </span>
          <van-icon
            alt
            name="success"
            v-if="
              item.platform_list.length === 0 &&
              ((activeChooseFrom === 0 && chooseType === 0) ||
                (activeChooseTo === 0 && chooseType === 1))
            "
          />
        </div>
        <div
          v-for="(val, ind) in item.platform_list"
          :key="ind"
          class="son"
          :class="((activeChooseFrom === val.game_platform_id && chooseType === 0) ||
          (activeChooseTo === val.game_platform_id && chooseType === 1)) ? 'select' : ''"
          v-show="showSon && val.status === 1 && activeList.includes(index)"
        >
          <p @click="chooseSon(val, item.game_cate_id)" class="name">
            {{ val.game_platform_name }}(
            <span v-money:[1000]="val.money"></span>)
          </p>
          <van-icon
            name="success"
            v-if="
              (activeChooseFrom === val.game_platform_id && chooseType === 0) ||
              (activeChooseTo === val.game_platform_id && chooseType === 1)
            "
          />
        </div>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import {
  inject,
  ref,
  defineEmits,
  defineProps,
  watch,
} from 'vue';
import Popup from './index.vue';

const props = defineProps({
  title: String,
  walletList: Array,
  isShow: Boolean,
  walletInfo: Object,
  state: {
    type: Object,
    default: () => ({}),
  },
  shareWallet: {
    type: Array,
    default: () => [],
  },
  activeChooseFrom: Number,
  activeChooseTo: Number,
  fromCateId: Number,
  toCateId: Number,
  chooseType: {
    type: Number,
    default: 0,
  },
});
const showSon = ref(true);
const global = inject('global');
const activeList = ref([]);
const emit = defineEmits([
  'update:state',
  'update:activeChooseFrom',
  'update:activeChooseTo',
  'update:allMoney',
  'update:fromCateId',
  'update:toCateId',
  'close',
]);

watch(() => props.isShow, (val) => {
  if (val) {
    const {
      walletList, fromCateId, toCateId, chooseType, activeChooseFrom, activeChooseTo,
    } = props;
    if ((chooseType === 0 && activeChooseFrom === 0) || (chooseType === 1 && activeChooseTo === 0)) {
      activeList.value = [0];
    } else {
      walletList.map((item, index) => {
        if (chooseType === 0) {
          if (item.game_cate_id === fromCateId) {
            activeList.value = [index];
          }
        } else if (chooseType === 1) {
          if (item.game_cate_id === toCateId) {
            activeList.value = [index];
          }
        }
      });
    }
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
  if (index === 0) {
    if (props.chooseType === 0) {
      emit('update:activeChooseFrom', 0);
      emit('update:state', {
        ...props.state,
        from_platform_id: 0,
        from_platform_name: global.$t('中心钱包'),
        from_money: props.walletInfo.money,
      });
      emit('update:allMoney', props.walletInfo.money);
      // this.allMoney = this.wallet.money;
    } else {
      emit('update:activeChooseTo', 0);
      emit('update:state', {
        ...props.state,
        to_platform_id: 0,
        to_platform_name: global.$t('中心钱包'),
        to_money: props.walletInfo.money,
      });
    }
    emit('close');
  } else {
    showSon.value = true;
  }
}

function chooseSon(val, cateId) {
  if (props.chooseType === 0) {
    emit('update:fromCateId', cateId);
  } else if (props.chooseType === 1) {
    emit('update:toCateId', cateId);
  }
  emit('update:cateId', cateId);
  const temp = props.walletList.filter(
    (item) => item.game_cate_id === cateId,
  )[0].game_cate_name;

  if (props.chooseType === 0) {
    emit('update:activeChooseFrom', val.game_platform_id);
    emit('update:state', {
      ...props.state,
      from_platform_id: val.game_platform_id,
      from_platform_name: `${temp}/${val.game_platform_name}`,
      from_money: val.money || '0.00',
      from_money_code: val.money_code,
    });
    emit('update:allMoney', props.state.from_money);
  } else {
    emit('update:activeChooseTo', val.game_platform_id);
    emit('update:state', {
      ...props.state,
      to_platform_id: val.game_platform_id,
      to_platform_name: `${temp}/${val.game_platform_name}`,
      to_money: val.money || '0.00',
      to_money_code: val.money_code,
    });
  }
  emit('close');
}
</script>

<style scoped lang="less">
.wallet-transfer-wrap {
  .wallet-transfer-body {
    padding: 10px 0 75px;
    overflow: hidden;
    height: 800px;
    overflow-y: scroll;
    box-sizing: border-box;

    p {
      margin: 0;
    }

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
      > .item {
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;

        margin: 0 30px;
        .van-icon-success {
          color: var(--font-color-ffffff);
        }

        > .name {
          color: var(--dark-fff, var(--font-color-333333));
          float: left;
        }

        > span {
          > .arrow_b {
            transition: all 0.5s;
            height: 30px;
            color: var(--dark-fff, var(--font-color-999));
            &.active {
              transform: rotateZ(-180deg);
            }
          }
        }
      }

      &.select {
        background-color: var(--theme-color);
        color: var(--font-color-ffffff);
        .son {
          padding: 0 30px 0 70px;
          border: 0;
          .name {
            color: var(--font-color-ffffff);
          }
        }
        .name {
          color: var(--font-color-ffffff);
        }
        .item {
          border: 0;
        }
      }

      > .son {
        line-height: 98px;
        font-size: 32px;
        height: 98px;
        padding-left: 40px;
        background-color: var(--theme-color);
        color: var(--font-color-ffffff);
        position: relative;
        display: flex;
        align-items: center;

        .van-icon-success {
          color: var(--font-color-ffffff);
        }

        &:last-child {
          border-bottom: 0;
        }

        > .name {
          float: left;
          flex: 1;
        }

        > img {
          display: block;
          width: 44px;
          height: 44px;
          margin: 28px 30px 0 0;
          float: right;

          &.shareImg {
            position: absolute;
            left: 0;
            top: -4px;
            margin: 0;
          }
        }
      }
    }
  }

  .van-icon-arrow {
    color: var(--dark-fff);
  }
}
</style>
