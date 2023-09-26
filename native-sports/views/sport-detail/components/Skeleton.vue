<template>
  <div
    class="detail-skeleton-wrap"
    :class="{ dark: app.darkTheme === 'dark' }"
  >
    <div class="top-wrap">
      <div class="nav-bar">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="score-wrap">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="action-wrap">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="center-wrap">
      <div>
        <span></span>
        <span></span>
      </div>
      <div>
        <span></span>
        <span></span>
      </div>
      <div>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="tab-wrap">
      <span></span><span></span><span></span><span></span>
    </div>
    <div class="divider"></div>
    <div class="odds-wrap">
      <div class="head">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div
        class="odds-item"
        v-for="item in 3"
        :key="item"
      >
        <div>
          <span></span>
          <span></span>
        </div>
        <div>
          <span></span>
          <span></span>
        </div>
        <div>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style lang="less" scoped>
.detail-skeleton-wrap {
  height: 100vh;
  width: 100vw;
  overflow-y: hidden;

  &:after {
    content: '';
    opacity: 0.3;
    width: 100px;
    height: 100%;
    background: linear-gradient(to left, rgba(255, 255, 255, 0), var(--bg-skeleton-light), rgba(255, 255, 255, 0));
    position: absolute;
    left: 800px;
    top: 0;
    z-index: 2;
    animation: move 1s linear infinite;
    transform: skewX(-4deg);

    @keyframes move {
      0% {
        left: -30px
      }

      100% {
        left: 500px;
      }
    }
  }

  &.dark {
    &::after {
      background: linear-gradient(to left, rgba(255, 255, 255, 0), rgba(#fff, 0.2), rgba(255, 255, 255, 0));
    }
  }

  span {
    background-color: var(--dark-bg-color-33323E, var(--bg-skeleton-dark));
    display: block;
  }

  .divider {
    height: 20px;
    background-color: var(--dark-000, var(--bg-color-fff));
  }

  .odds-wrap {
    background-color: var(--dark-000, var(--bg-color-fff));
    padding: 28px 32px 0 32px;

    span {
      background-color: var(--dark-bg-color-33323E, var(--bg-skeleton-dark));
    }

    .odds-item {
      padding: 20px 32px;
      background-color: var(--dark-card-bg-color, var(--bg-color-fff));
      border: solid 1px var(--bg-skeleton-dark, var(--border-color-E6EBF1));
      border-radius: 12px;
      margin-bottom: 28px;

      div {
        display: flex;

        &:not(:last-child) {
          margin-bottom: 14px;
        }

        span {
          height: 36px;
          width: 290px;

          &:nth-child(1) {
            margin-right: auto;
          }
        }

        &:nth-child(1) span {
          width: 104px;

          &:nth-child(1) {
            margin-right: 224px;
          }
        }
      }
    }

    .head {
      display: flex;
      align-items: center;
      padding-bottom: 16px;

      span {
        height: 28px;
        width: 28px;

        &:nth-child(2) {
          width: 104px;
          margin-right: auto;
          margin-left: 6px;
        }
      }
    }
  }

  .tab-wrap {
    background-color: var(--dark-card-bg-color, var(--bg-skeleton-card));
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 46px;
    height: 100px;

    span {
      border-radius: 19px;
      height: 38px;
      width: 112px;

      &:nth-child(2) {
        width: 200px;
      }
    }
  }

  .center-wrap {
    height: 86px;
    background-color: var(--dark-card-bg-color, var(--bg-color-ededed));
    display: flex;
    align-items: center;

    span {
      background-color: var(--dark-bg-color-33323E, var(--bg-color-fff));
    }

    div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        height: 38px;
        width: 50px;

        &:first-child {
          width: 38px;
          margin-right: 8px;
        }
      }

      &:not(:last-child) {
        border-right: solid 1px var(--dark-bg-color-33323E, var(--bg-color-fff));
      }
    }
  }

  .action-wrap {
    margin-top: 86px;
    padding: 0 36px;
    box-sizing: border-box;
    display: flex;
    height: 32px;
    justify-content: space-between;

    span {
      height: 32px;
      width: 32px;

      &:nth-child(1) {
        width: 472px;
        margin-right: auto;
      }

      &:nth-child(2) {
        margin-right: 28px;
      }
    }
  }

  .score-wrap {
    margin-top: 76px;
    padding: 0 36px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    span {
      height: 128px;
      width: 128px;

      &:nth-child(2) {
        width: 218px;
      }
    }
  }

  .top-wrap {
    box-sizing: border-box;
    height: 456px;
    width: 100%;
    background-color: var(--dark-1b1a20, var(--bg-skeleton-dark));

    span {
      background-color: var(--dark-bg-color-33323E, var(--bg-color-fff));
    }

    .nav-bar {
      height: 100px;
      display: flex;
      align-items: center;
      padding: 0 24px;

      span {
        height: 36px;
        width: 36px;
        display: block;

        &:nth-child(2) {
          margin: 0 auto;
          width: 296px;
        }

        &:nth-child(3) {
          margin-right: 40px;
        }
      }
    }
  }
}
</style>

<script setup>
import { useStore } from 'vuex';

const store = useStore();

const { app } = store.state;
</script>
