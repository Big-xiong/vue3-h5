<template>
  <Popup
    @close="emit('update:showFilter', false)"
    :teleport="'body'"
    :show="showFilter"
    :title="$t('筛选')"
    :action="$t('确定')"
    @action="confirmSelect"
  >
    <div class="filter-wrap">
      <header>{{ $t('投注时间') }}</header>
      <div class="picker-wrap">
        <div
          class="picker-item"
          @click="showStart = true"
        >
          <span>{{ startTime || $t('开始时间') }}</span>
          <SvgIcon
            color="var(--font-color-848A9B)"
            name="sport-calendar"
          />
        </div>
        <div
          class="picker-item"
          @click="showEnd = true"
        >
          <span>{{ endTime || $t('结束时间') }}</span>
          <SvgIcon name="sport-calendar" />
        </div>
      </div>
    </div>
  </Popup>

  <van-popup
    v-model:show="showStart"
    position="bottom"
    teleport="body"
    round
  >
    <van-datetime-picker
      v-model="start"
      type="date"
      @confirm="confirmSelect('startTime')"
      @cancel="showStart = false"
      :title="$t('选择开始时间')"
    />
  </van-popup>
  <van-popup
    v-model:show="showEnd"
    position="bottom"
    teleport="body"
    round
  >
    <van-datetime-picker
      v-model="end"
      type="date"
      @confirm="confirmSelect('endTime')"
      @cancel="showEnd = false"
      :title="$t('选择结束时间')"
    />
  </van-popup>
</template>

<script setup>
import dayjs from 'dayjs';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import Popup from '../../../../components/Popup.vue';
import SvgIcon from '../../../../../src/components/SvgIcon.vue';

const emit = defineEmits(['update:showFilter', 'update:startTime', 'update:endTime']);

const props = defineProps({
  showFilter: Boolean,
  startTime: String,
  endTime: String,
});

const showStart = ref(false);
const showEnd = ref(false);
const { t } = useI18n();
const start = ref(props.startTime ? new Date(props.startTime) : new Date());
const end = ref(props.endTime ? new Date(props.endTime) : new Date());

function confirmSelect(target) {
  if (start.value > end.value) {
    return Toast(t('开始时间不能小于结束时间'));
  } if (!target) {
    return emit('update:showFilter', false);
  }
  emit(`update:${target}`, dayjs(start.value).format('YYYY-MM-DD'));
  emit(`update:${target}`, dayjs(end.value).format('YYYY-MM-DD'));
  showStart.value = false;
  showEnd.value = false;
}

</script>

<style lang="less" scoped>
.filter-wrap {
  header {
    font-size: 28px;
    margin-top: 40px;
    margin-bottom: 14px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-0A0A0A));
  }

  .picker-wrap {
    display: flex;
    justify-content: space-between;

    .picker-item {
      width: 320px;
      height: 68px;
      border-radius: 8px;
      border: 2px solid var(--dark-4E4C5D, var(--bg-color-e6ebf1));
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 26px;
      font-size: 28px;
      font-weight: 400;
      color: var(--font-color-848A9B);

      .svg-icon-wrap {
        width: 28px;
        height: 28px;
      }
    }
  }

  .game-platform {
    height: 68px;
    padding: 0 26px;
    font-size: 28px;
    color: var(--dark-fff, var(--font-color-0A0A0A));
    justify-content: space-between;
    display: flex;
    align-items: center;
    border-radius: 8px;
    border: 2px solid var(--dark-4E4C5D, var(--bg-color-e6ebf1));
  }
}
</style>
