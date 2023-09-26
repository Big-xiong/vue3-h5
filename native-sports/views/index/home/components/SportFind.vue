<template>
  <div class="sport-find-wrap">
    <van-nav-bar
      :title="$t('筛选')"
      :border="false"
      left-arrow
      @click-left="emit('handleShowFind', false)"
    />
    <main>
      <div
        v-for="(val, key) in leaguesList"
        :key="key"
      >
        <h4 class="bold">{{ key }}</h4>
        <ul>
          <li
            v-for="(league, i) in leaguesList[key]"
            @click="handleSelect(league.item)"
            :key="i"
          >
            <SvgIcon :name="isSelected(league.item) ? 'sport-selected' : 'sport-unselected'" />
            <p>{{ league.item }}</p>
          </li>
          <!-- <li>
            <SvgIcon name="sport-unselected" />
            阿莫勒斯
          </li> -->
        </ul>
      </div>
    </main>
    <div class="sport-find-wrap-footer">
      <div
        class="sport-find-wrap-footer-left"
        @click="handleSelectAll"
      >
        <SvgIcon :name="isCheckAll ? 'sport-selected' : 'sport-unselected'" />

        <span>{{ isCheckAll ? $t('全不选') : $t('全选') }}</span>
      </div>
      <div class="sport-find-wrap-footer-right">
        <span>{{ $t('已选') }}{{ selectedLeagues.length }}{{ $t('个联赛') }}</span>
        <van-button
          :loading="saveLoading"
          type="primary"
          @click="handleSave"
        >{{ $t('确定') }}</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRequest } from 'ahooks-vue';
import { user_leagues, leagues_save, GetLeagues } from '/native-sports/api/home';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import SvgIcon from '@/components/SvgIcon.vue';
import { pinying_group } from '../../../../api/home';

const emit = defineEmits(['handleShowFind', 'update:selectedLeagues']);
const leaguesList = ref({});
const len = ref(0);
// const selectedLeagues = ref([]);

const props = defineProps({
  selectedLeagues: {
    type: Array,
    default: () => [],
  },
});

const leagueData = ref([]);

const isCheckAll = computed(() => props.selectedLeagues.length === len.value);

function isSelected(name) {
  const { leagueId } = leagueData.value.find((league) => league.leagueName === name);
  return props.selectedLeagues.includes(leagueId);
}

useRequest(() => GetLeagues(), {
  manual: false,
  formatResult(res) {
    return res.leagues;
  },
  async onSuccess(res) {
    leagueData.value = [];
    res.forEach((item) => {
      if (!leagueData.value.find((sub) => sub.leagueId === item.leagueId)) {
        leagueData.value.push(item);
      }
    });
    len.value = leagueData.value.length;
    emit('update:selectedLeagues', leagueData.value.map((item) => item.leagueId));

    const pinyin = await pinying_group({
      items: leagueData.value.map((item) => item.leagueName),
    });

    leaguesList.value = pinyin;

    if (props.selectedLeagues.length === len.value) {
      isCheckAll.value = true;
    } else {
      isCheckAll.value = false;
    }
  },
});

function handleSelect(item) {
  const { leagueId } = leagueData.value.find((league) => league.leagueName === item);
  console.log('id', leagueId);
  if (props.selectedLeagues.includes(leagueId)) {
    const index = props.selectedLeagues.indexOf(leagueId);
    const holder = props.selectedLeagues.concat([]);
    holder.splice(index, 1);
    emit('update:selectedLeagues', holder);
  } else {
    emit('update:selectedLeagues', props.selectedLeagues.concat([leagueId]));
  }
}

const { t } = useI18n();

async function handleSave() {
  if (props.selectedLeagues.length) {
    emit('handleShowFind', false);
  } else {
    Toast(t('请至少选中一个联赛'));
  }
}

function handleSelectAll() {
  let selectedLeagues = [];
  if (!isCheckAll.value) {
    selectedLeagues = leagueData.value.map((item) => item.leagueId);

    emit('update:selectedLeagues', selectedLeagues);
  } else {
    emit('update:selectedLeagues', []);
  }
}

</script>

<style lang="less" scoped>
.sport-find-wrap {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  background: var(--dark-bg-color-18171D, var(--bg-color-fff));
  z-index: 2;
  flex: 1;
  transform: translateZ(0);
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  :deep(.van-nav-bar) {
    background-color: var(--dark-card-bg-color);

    .van-nav-bar__title {
      max-width: 80%;
      font-size: 36px;
      color: var(--dark-fff, var(--font-color-0A0A0A));
    }

    &.van-hairline--bottom::after {
      border: 0;
    }

    i {
      color: var(--dark-fff, var(--font-color-595757)) !important;
    }
  }

  .sport-unselected,
  .sport-selected {
    width: 35px;
    height: 35px;
    flex-shrink: 0;
  }

  main {
    flex: 1;
    padding: 0 32px;
    overflow-y: auto;
    padding-bottom: 100px;

    >div {
      h4 {
        font-size: 32px;
        margin: 20px 0 32px;
        text-transform: uppercase;
        font-weight: bold;
        color: var(--dark-fff);
      }

      ul {
        display: flex;
        flex-direction: column;

        li {
          display: flex;
          align-items: center;
          font-size: 28px;
          color: var(--dark-fff, var(--font-color-0A0A0A));
          margin-bottom: 32px;

          .sport-unselected,
          .sport-selected {
            margin-right: 16px;
          }

          p {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis; //文本溢出显示省略号
            white-space: nowrap; //文本不会换行
          }
        }
      }
    }
  }

  &-footer {
    height: 88px;
    box-shadow: 0px -10px 28px 0px var(--footer-shadow-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    background: var(--dark-card-bg-color, var(--bg-color-fff));
    position: fixed;
    bottom: 0;
    width: 100%;

    .van-button--primary {
      width: 200px;
      height: 68px;
      border-radius: 8px;
      color: var(--font-color-fff);
      background: var(--gradient-bg-color);
      border: 0;
    }

    &-left {
      display: flex;
      align-items: center;
      color: var(--dark-fff, var(--font-color-848A9B));
      font-size: 28px;

      span {
        margin-left: 14px;
      }
    }

    &-right {
      display: flex;
      align-items: center;

      span {
        margin-right: 24px;
        font-size: 28px;
        color: var(--dark-fff, var(--font-color-0A0A0A));
      }
    }
  }
}
</style>
