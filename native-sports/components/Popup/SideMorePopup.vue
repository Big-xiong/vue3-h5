<template>
  <div class="more-wrap">
    <ul class="more-wrap-top">
      <SvgIcon
        name="sport-close"
        @click="handleClose"
      />
      <li>Hi，{{ mainUser?.userInfo?.username }}</li>
      <li>
        ¥{{ user.balance?.toFixed(2) || 0.00 }}
        <SvgIcon
          name="sport-refresh"
          color="var(--theme-color)"
          :class="{ 'active': mainUser.walletLoading || mainUser.uploadWalletLoading || true }"
          @click="updateUserInfo"
        />
      </li>
    </ul>
    <main>
      <div>
        <section @click="handleChose('pan')">
          <div class="more-wrap-left">
            <SvgIcon :name="`sport-side_pan`" />
            {{ $t('盘口') }}
          </div>
          <div class="more-wrap-right">
            <div class="more-wrap-change-map">
              <span>{{ currentPanName }}</span>
              <span>{{ $t('切换盘口') }}</span>
            </div>
            <SvgIcon name="sport-exchange_up" />
          </div>
        </section>
        <ul :class="{ 'hasChose': hasChose === 'pan' }">
          <li
            v-for="(n, n_i) in panMap"
            :key="n_i"
            @click="handlePan(n)"
          >
            {{ n.name }}
            <SvgIcon
              name="sport-selected"
              v-show="n.val === currentPan"
            />
          </li>
        </ul>
      </div>
      <div>
        <section @click="handleChose('lang')">
          <div class="more-wrap-left">
            <SvgIcon name="sport-side_lang" />
            {{ currentLangName }}
          </div>
          <div class="more-wrap-right">
            <div class="more-wrap-change-map">
              <span>{{ currentLangName }}</span>
              <span>{{ $t('切换语言') }}</span>
            </div>
            <SvgIcon name="sport-exchange_up" />
          </div>
        </section>
        <ul :class="{ 'hasChose': hasChose === 'lang' }">
          <li
            v-for="(n, n_i) in langMap"
            :key="n_i"
            @click="handleLang(n)"
          >
            {{ n.name }}
            <SvgIcon
              name="sport-selected"
              v-show="n.val === currentLang"
            />
          </li>
        </ul>
      </div>
      <div @click="$router.push('/rules')">
        <section>
          <div class="more-wrap-left">
            <SvgIcon name="sport-side_rule" />
            {{ $t('规则说明') }}
          </div>
          <van-icon name="arrow" />
        </section>
      </div>
      <div>
        <section>
          <div class="more-wrap-left">
            <SvgIcon name="sport-side_mode" />
            {{ $t('换肤') }}
          </div>
          <div
            class="switch-wrap"
            @click="changeTheme"
            :class="{ dark: isDark }"
          >
            <div>
              <img
                :src="$getSrc(`/src/assets/native-sports/images/${isDark ? 'dark-theme' : 'white-theme'}.png`)"
                alt=""
              >
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  ref, inject, watch, computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import SvgIcon from '@/components/SvgIcon.vue';
// import { i18n } from '../../main';

const { t } = useI18n();
const global = inject('global');

const hasChose = ref('');

const store = useStore();
const { mainUser, user } = store.state;

const currentLang = computed(() => store.state.app.lang);
const currentPan = computed(() => store.state.app.pan);

const isDark = computed(() => store.state.app.darkTheme !== 'normal');

function changeTheme() {
  store.commit('app/SET_DARK_THEME', isDark.value ? 'normal' : 'dark');
}

const langMap = ref([
  { name: t('简体中文'), val: 'cs' }, { name: t('English'), val: 'en' }, { name: t('越南'), val: 'vn' }, { name: t('泰文'), val: 'th' },
]);

const panMap = ref([
  { name: t('欧洲盘'), val: 'decimalPrice' },
  { name: t('香港盘'), val: 'hongKongPrice' },
  { name: t('印度盘'), val: 'indoPrice' },
  { name: t('马来盘'), val: 'malayPrice' },
  { name: t('美国盘'), val: 'americanPrice' },
]);

const currentLangName = computed(() => langMap.value.find((item) => item.val === currentLang.value)?.name ?? '');
const currentPanName = computed(() => panMap.value.find((item) => item.val === currentPan.value)?.name ?? '');

const emit = defineEmits(['handleShowPopup']);

function handleClose() {
  emit('handleShowPopup', false);
}

function updateUserInfo() {
  global.$store.dispatch('mainUser/getWalletInfo');
}

function handleChose(target) {
  if (hasChose.value === target) { hasChose.value = ''; } else { hasChose.value = target; }
}

function handleChange(item) {
  if (item.icon !== 'lang') {
    item.changeMap.reverse();
    global.$store.commit(`app/SET_${item.icon.toUpperCase()}`, item.changeMap[0].val);
  }
}
function handlePan(n) {
  global.$store.commit(`app/SET_PAN`, n.val);
  hasChose.value = '';
}

function handleLang(n) {
  global.$store.commit(`app/SET_LANG`, n.val);
  global.i18n.global.locale.value = n.val;
  hasChose.value = '';
}

</script>

<style lang="less" scoped>
.more-wrap {
  .switch-wrap {
    width: 72px;
    height: 36px;
    border-radius: 18px;
    background-color: var(--dark-34323f, var(--theme-color));
    position: relative;

    div {
      position: absolute;
      border-radius: 100%;
      width: 30px;
      height: 30px;
      top: 3px;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateX(3px);
      transition: all 0.3s ease-out;

      img {
        width: 25px;
        height: 25px;
      }
    }

    &.dark {
      div {
        transform: translateX(36px);
      }
    }
  }

  &-top {
    border-bottom: 20px solid var(--dark-bg-color-18171D, var(--border-color-F9F9F9));
    padding: 46px 0 22px 0;

    .sport-close {
      width: 24px;
      height: 24px;
      margin: 40px 0 46px 40px;
      fill: var(--dark-fff, var(--font-color-000));
    }

    li {
      padding: 0 32px 0 40px;
      color: var(--dark-fff);

      .sport-refresh {
        width: 20px;
        height: 20px;
      }
    }
  }

  main {
    >div {

      section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28px;
        margin: 0 32px 0 40px;
        color: var(--dark-fff, var(--font-color-0A0A0A));
        border-bottom: 2px solid var(--dark-border-color-3F3D4B, var(--border-color-E6EBF1));

        .more-wrap-left {
          line-height: 100px;
          display: flex;
          align-items: center;

          .svg-icon-wrap {
            width: 44px;
            height: 44px;
            fill: var(--dark-fff, var(--font-color-000));

            &.sport-side_rate,
            &.sport-side_lang,
            &.sport-side_rule {
              stroke: var(--dark-fff, var(--font-color-000));
            }
          }
        }

        .van-icon-arrow {
          color: var(--font-color-848A9B);
        }

        div {
          white-space: nowrap;
        }

        .more-wrap-right {
          display: flex;
          align-items: center;

          .more-wrap-change-map {
            display: flex;
            flex-direction: column;
            align-items: flex-end;

            span {
              font-size: 20px;
              color: var(--font-color-929292);

              &:first-child {
                font-size: 24px;
                color: var(--theme-color);
              }
            }
          }

          .sport-exchange_up {
            width: 14px;
            height: 14px;
            margin-left: 8px;
          }
        }
      }

      ul {
        margin: 0 32px 0 40px;
        padding: 20px 22px 26px 38px;
        display: none;

        &.hasChose {
          display: block;
        }

        li {
          color: var(--dark-fff, var(--font-color-0A0A0A));
          font-size: 28px;
          line-height: 40px;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &:last-child {
            margin-bottom: 0;
          }

          .sport-selected {
            width: 24px;
            height: 24px;
          }
        }
      }
    }
  }
}
</style>
