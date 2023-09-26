<template>
  <div class="digitalAddress-wrap">
    <ul>
      <li v-for="(item, index) in walletList" :key="index">
        <div class="top">
          <h4 @click="handleChose(item)">{{ item.remark }}</h4>
          <p @click="handleChose(item)">
            <template v-if="item.address.length < 15">{{ item.address }}</template>
            <template v-else>{{
              `${item.address.substr(0,
                6)}...${item.address.substr(item.address.length - 7)}`
            }}</template>
          </p>
          <van-icon name="edit" @click="handleAdd(item)" />
          <van-icon name="delete-o" @click="handleDel(item)" />
        </div>
        <div class="bottom">
          <p>{{ item.updated_at }}</p>
        </div>
      </li>
    </ul>
    <div class="empty" v-show="!walletList?.length && loadedData">
      <SvgIcon name="address" />
      <p>{{ $t('暂未添加收币地址') }}</p>
    </div>
    <div class="ui-buttons">
      <van-button type="primary" @click="$router.push({ name: 'centerAddDigitalAddress' })">{{ $t('添加地址') }}
      </van-button>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, h, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import { Dialog, Toast } from 'vant';
import {
  digwalletlist, deldigwallet,
} from '@/api/center';
import SvgIcon from '@/components/SvgIcon.vue';

scroll(0, 0);
const global = inject('global');
const loadedData = ref(false);

const { run: walletListRun, data: walletList, loading: walletLoading } = useRequest(digwalletlist, {
  manual: true,
  onSuccess() {
    loadedData.value = true;
  },
});
const { run: delRun } = useRequest(deldigwallet, {
  manual: true,
  onSuccess() {
    walletListRun();
  },
});

function handleAdd(item) {
  global.$router.push({
    name: 'centerAddDigitalAddress',
    query: { param: JSON.stringify(item) },
  });
}
function handleDel(val) {
  Dialog.confirm({
    // title: global.$t('是否确认删除该地址'),
    message: () => h('div', [
      h('p', [
        h('i', {
          class: ['van-badge__wrapper', 'van-icon', 'van-icon-warning'],
        }),
      ]),
      h('p', global.$t('是否确认删除该地址')),
    ]),
    className: 'dialog-del-address',
    cancelButtonText: global.$t('取消'),
    confirmButtonText: global.$t('确认'),
  }).then(() => {
    delRun({ id: val.id });
  });
}

onMounted(async () => {
  Toast.loading();
  await walletListRun();
  Toast.clear();
});

function handleChose(item) {
  global.$router.push({
    name: 'centerWithdraw',
    query: { param: JSON.stringify({ ...item, type: 2 }) },
  });
}

</script>

<style lang="less" scoped>
.digitalAddress-wrap {
  padding: 0 30px 30px;

  ul {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-top: 60px;

    li {
      width: 100%;
      padding: 26px 30px 14px 30px;
      border-radius: 8px;
      margin-bottom: 24px;
      background: var(--dark-333, var(--bg-color-f6f6f6));

      &:focus {
        border: 2px solid var(--theme-color);
      }

      .top {
        position: relative;
        border-bottom: 1px solid var(--border-color-e7e7e7);

        h4 {
          font-size: 32px;
          color: var(--dark-ccc, var(--font-color-333333));
          line-height: 44px;
          margin-bottom: 6px;
          margin-top: 0;
          height: 44px;
          width: 80%;
          display: inline-block;
        }

        p {
          font-size: 28px;
          color: var(--font-color-999999);
          margin-bottom: 12px;
          line-height: 40px;
          width: 80%;
          display: inline-block;
        }

        .van-icon {
          position: absolute;
          z-index: 99;
          right: 0;
          top: 34px;
          font-size: 34px;
          cursor: pointer;
          color: var(--theme-color);

          &.van-icon-edit {
            right: 80px;
          }

          span {
            position: relative;
            top: -4px;
          }
        }
      }

      .bottom {
        p {
          color: var(--font-color-999999);
          font-size: 24px;
          line-height: 34px;
          margin-top: 14px;
        }
      }
    }
  }

  .empty {
    text-align: center;
    margin: 180px 0;

    .svg-icon-wrap {
      width: 116px;
      height: 116px;
    }

    p {
      font-size: 28px;
      margin-top: 18px;
      color: var(--font-color-525152);
    }
  }

  .ui-buttons {
    .van-button {
      width: 100%;
    }
  }

  .van-icon-warning {
    width: 68px;
    height: 68px;
    color: var(--theme-color);
  }
}
</style>
