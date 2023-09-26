<template>
  <div class="addDigAddress-wrap">
    <van-nav-bar class="m-header" :title="title" left-arrow @click-left="$router.go(-1)" />
    <div class="addDigAddress-wrap-main">
      <ul class="withdraw-form">
        <li class="dig-wrap">
          <label>{{ $t('提款币种') }}</label>
          <div class="layout-flex-center input" @click="showDig">
            <input style="text-transform: uppercase;" disabled type="text" v-model="form.type" />
            <van-icon name="arrow-down" />
          </div>
        </li>
        <li class="dig-wrap">
          <label>{{ $t('协议') }}</label>
          <div class="protocol">
            <span :class="{ 'active': form.protocol === item.value }" @click="form.protocol = item.value"
              v-for="(item, index) in protocalList?.filter(m => m.type === form.type)[0]?.protocol ?? []"
              :key="index">{{ item.name }}</span>
          </div>
        </li>
        <li class="dig-wrap">
          <label>{{ $t('收币地址') }}</label>
          <div class="input">
            <input type="text" v-model="form.address" :placeholder="$t(`请输入或粘贴{1}地址`, [form.protocol])" />
          </div>
        </li>
        <li class="dig-wrap">
          <label>{{ $t('备注') }}</label>
          <div class="input">
            <input type="text" v-model="form.remark" />
          </div>
        </li>
      </ul>
      <div class="ui-buttons">
        <van-button :loading="loading" type="primary" @click="save">{{ $t('保存') }}</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, computed, watch, toRaw, nextTick, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { dateFormat } from '@/utils';
import { staticprotocol, adddigwallet, getticker } from '@/api/center';
import Form from '@/components/Form/index.vue';

const global = inject('global');

const form = reactive({
  type: '',
  protocol: '',
  address: '',
  remark: '',
  id: '',
});
const route = useRouter();
const { query } = route.currentRoute.value;

const title = computed(() => global.$t(`${query?.param ? '编辑' : '新增'}货币地址`));

const time = dateFormat('HH:MM', (new Date()).getTime());

onMounted(() => {
  if (query.param) {
    const param = JSON.parse(query.param);
    nextTick(() => {
      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(toRaw(form))) {
        form[key] = param[key];
      }
    });
  }
});

watch(() => form.protocol, (val) => {
  form.remark = `${val} ${time}`;
});

// 汇率
const { run: tickerRun, data: tickerList } = useRequest(getticker, {
  manual: true,
});
// 提款币种
const { run: protocalRun, data: protocalList, loading: protocalLoading } = useRequest(staticprotocol, {
  onSuccess(res) {
    form.type = res[0]?.type;
    if (query?.param) {
      const params = JSON.parse(query.param);
      form.protocol = params.protocol;
    } else {
      form.remark = `${res[0].protocol[0].value} ${time}`;
      form.protocol = res[0].protocol[0].value;
    }
  },
});

function handleProtocol(val) {
  form.protocol = val;
  tickerRun({ digital_mode_type: val });
}

function showDig() {
  global.$popup({
    tpl: 'DigitalType',
    list: protocalList.value,
    onSelect(data) {
      form.dig_mode_type = data.type;
    },
  });
}

const { run: saveRun, loading: saveLoading } = useRequest(adddigwallet, {
  manual: true,
  onSuccess() {
    global.$router.push({ name: 'centerDigitalAddress' });
    // digitalDia.value = false;
    // walletListRun();
  },
});
function save() {
  if (!form.address) {
    Toast.fail(global.$t('请输入收币地址！'));
    return;
  }
  saveRun(form);
}

</script>

<style lang="less">
.addDigAddress-wrap {
  &-main {
    padding: 0 30px 30px;
    margin-top: 40px;
  }

  li {
    width: 100%;
    color: var(--dark-fff, var(--font-color-222930));
    padding: 10px 0;

    &.dig-wrap {
      border: 0;
      margin-bottom: 40px;

      label {
        color: var(--dark-fff, var(--font-color-999999));
      }

      .input {
        display: flex;
        align-items: center;
        height: 88px;
        line-height: 88px;
        border: 2px solid var(--border-color-525152-02);
        border-radius: 8px;
        margin-top: 30px;
        color: var(--font-color-333333, var(--dark-525152));

        input {
          width: 90%;
          padding-left: 40px;
          font-size: 28px;
          background: none;
          border: 0;
        }

        i {
          margin-right: 36px;
        }

        span {
          position: relative;
        }

        img {
          position: absolute;
          top: 50%;
          right: 36px;
          margin-top: -18px;
          width: 36px;
        }
      }

      .protocol {
        margin-top: 10px;

        span {
          display: inline-block;
          width: 200px;
          height: 80px;
          border-radius: 12px;
          opacity: 0.4;
          border: 2px solid var(--dark-525152, var(--border-color-00002));
          line-height: 80px;
          text-align: center;
          font-size: 28px;
          margin-right: 20px;

          &.active {
            border: 4px solid var(--theme-color);
            color: var(--theme-color);
            opacity: 1;
          }
        }
      }
    }
  }

  .ui-buttons {
    .van-button {
      width: 100%;
    }
  }
}
</style>
