<template>
  <div class="restricted-wrapper">
    <div class="inner-bg"></div>

    <van-image fit="contain" class="logo" :src="$getSrc(`/src/assets/images/restricted-logo.png`)" />
    <header>
      <SvgIcon name="restricted" />
      {{ $t('访问受限') }}
    </header>

    <div class="text-wrapper">
      <div class="text-item">
        <div class="title">
          <van-image :src="$getSrc('/src/assets/images/flag-en.png')" class="flag" />
          <span>Dear members</span>
        </div>
        <div class="text">
          The page that you are trying to access has been restricted in this location. We apologize for any inconvenience that this may have caused. Should you have any inquiries, please contact our customer service centre at
          <span
            v-clipboard:copy="'customerservice@blizzwin.com'"
            v-clipboard:success="onCopy"
          >customerservice@blizzwin.com</span>
          or Live Help
        </div>
      </div>
      <div class="text-item">
        <div class="title">
          <van-image :src="$getSrc('/src/assets/images/flag-cn.png')" class="flag" />
          <span>登录限制</span>
        </div>
        <div class="text">
          抱歉！您所在地区受到限制，无法正常游览我们的网站哦。若有不便之处，请多多原谅。若您有任何疑问，请联系我们的在线客服。或发邮件至
          <span
            v-clipboard:copy="'customerservice@blizzwin.com'"
            v-clipboard:success="onCopy"
          >customerservice@blizzwin.com</span>
        </div>
      </div>
      <div class="text-item">
        <div class="title">
          <van-image :src="$getSrc('/src/assets/images/flag-th.png')" class="flag" />
          <span>การเข้าสู่ระบบถูกจำกัด</span>
        </div>
        <div class="text">
          หน้าที่คุณเชื่อมต่อได้ถูกจำกัด ขออภัยในความไม่สะดวก หากคุณมีข้อสงสัยกรุณาติดต่อพนักงานฝ่ายบริการลูกค้าที่ เบอร์โทร+66600035187อีเมล:
          <span
            v-clipboard:copy="'customerservice@blizzwin.com'"
            v-clipboard:success="onCopy"
          >customerservice@blizzwin.com</span> หรือ ห้องช่วยเหลือสด
        </div>
      </div>
      <div class="text-item">
        <div class="title">
          <van-image :src="$getSrc('/src/assets/images/flag-vi.png')" class="flag" />
          <span>Đường dẫn hạn chế</span>
        </div>
        <div class="text">
          Đường dẫn mà quý khách đang truy nhập trên trang này bị hạn chế. Chúng tôi thành thật xin lỗi cho những bất tiện gây ra. Nếu quý khách có thắc mắc về vấn đề này, vui lòng liên hệ Bộ phận Chăm sóc Khách hàng tại Hotline (+84) 9077 605 94
          <span
            v-clipboard:copy="'customerservice@blizzwin.com'"
            v-clipboard:success="onCopy"
          >customerservice@blizzwin.com</span> hoặc hoặc Hồ Trợ Trực Tuyến
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { inject } from '@vue/runtime-dom';
import SvgIcon from '@/components/SvgIcon.vue';

const router = useRouter();

const textData = [
  {
    flag: '/src/assets/images/flag-en.png',
    title: 'Dear members',
    text: 'The page that you are trying to access has been restricted in this location. We apologize for any inconvenience that this may have caused. Should you have any inquiries, please contact our customer service centre at <span>customerservice@blizzwin.com</span> or Live Help',
  },
  {
    flag: '/src/assets/images/flag-cn.png',
    title: '登录限制',
    text: '抱歉！您所在地区受到限制，无法正常游览我们的网站哦。若有不便之处，请多多原谅。若您有任何疑问，请联系我们的在线客服。或发邮件至<span>customerservice@blizzwin.com</span>',
  },
  {
    flag: '/src/assets/images/flag-th.png',
    title: 'การเข้าสู่ระบบถูกจำกัด',
    text: 'หน้าที่คุณเชื่อมต่อได้ถูกจำกัด ขออภัยในความไม่สะดวก หากคุณมีข้อสงสัยกรุณาติดต่อพนักงานฝ่ายบริการลูกค้าที่ เบอร์โทร+66600035187อีเมล: <span>customerservice@blizzwin.com</span> หรือ ห้องช่วยเหลือสด',
  },
  {
    flag: '/src/assets/images/flag-vi.png',
    title: 'Đường dẫn hạn chế',
    text: 'Đường dẫn mà quý khách đang truy nhập trên trang này bị hạn chế. Chúng tôi thành thật xin lỗi cho những bất tiện gây ra. Nếu quý khách có thắc mắc về vấn đề này, vui lòng liên hệ Bộ phận Chăm sóc Khách hàng tại Hotline (+84) 9077 605 94 <span>customerservice@blizzwin.com</span> hoặc hoặc Hồ Trợ Trực Tuyến',
  },
];

const global = inject('global');

function onCopy() {
  Toast.success(global.$t('复制成功'));
}
</script>

<style lang="less" scoped>
.restricted-wrapper {
  width: 100vw;
  flex: 1;
  overflow-y: auto;
  height: 100%;
  background-color: var(--dark-2b2b2b, var(--bg-color-ffffff));
  position: relative;
  box-sizing: border-box;
  border: var(--dark-000, var(--theme-color)) solid 30px;
  .inner-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("/src/assets/images/Girls@2x.png");
    background-position: top center;
    background-size: 100% auto;
    background-repeat: no-repeat;
    opacity: 0.1;
  }

  > *:not(.inner-bg) {
    z-index: 0;
    position: relative;
  }
}

.logo {
  width: 246px;
  height: 42px;
  margin: 50px auto 28px auto;
  display: block;
}

header {
  display: flex;
  justify-content: center;
  font-weight: bold;
  font-size: 36px;
  color: var(--theme-color);
  align-items: center;

  .svg-icon-wrap {
    width: 56px;
    height: 56px;
  }
}

.text-wrapper {
  margin-top: 48px;
  box-sizing: border-box;
  padding: 0 40px 50px 40px;

  .text-item {
    &:not(:last-of-type) {
      margin-bottom: 30px;
    }
    .title {
      display: flex;
      margin-bottom: 6px;
      font-size: 36px;
      align-items: center;
      color: var(--dark-fff, var(---font-color-2e2e2e));
      .flag {
        width: 86px;
        height: 58px;
        margin-right: 24px;
      }
    }

    .text {
      font-size: 24px;
      line-height: 36px;
      color: var(--dark-fff, var(--font-color-817f7f));
      :deep(span) {
        color: var(--theme-color) !important;
      }
    }
  }
}
</style>
