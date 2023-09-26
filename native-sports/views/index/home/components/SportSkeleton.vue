<template>
  <div
    class="sport-skeleton-home-wrap"
    :class="{ dark: app.darkTheme === 'dark' }"
  >
    <div class="sport-skeleton-home-wrap-top">
      <span />
      <div>
        <span />
        <span />
      </div>
      <span />
    </div>
    <div class="sport-skeleton-home-wrap-middle">
      <ul class="top">
        <li
          v-for="item in 4"
          :key="item"
        />
      </ul>
      <ul class="middle">
        <li
          v-for="item in 4"
          :key="item"
        />
      </ul>
      <div class="bottom">
        <div>
          <span />
          <span />
        </div>
        <span />
      </div>
    </div>
    <ul class="sport-skeleton-home-wrap-bottom">
      <li
        v-for="item in 4"
        :key="item"
      >
        <div class="top">
          <div>
            <div>
              <span />
              <span />
            </div>
            <span />
          </div>
          <div>
            <span
              v-for="item in 6"
              :key="item"
            />
          </div>
        </div>
        <div class="bottom">
          <ul>
            <li
              v-for="item in 2"
              :key="item"
            >
              <span
                v-for="item in 5"
                :key="item"
              />
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';

const store = useStore();

const { app } = store.state;
</script>

<style lang="less" scoped>
.sport-skeleton-home-wrap {
  height: 100%;
  background-color: var(--app-bg-color);
  padding: 20px 32px 0;
  transform: translateZ(0);

  &:before {
    content: "";
    position: absolute;
    top: 0;
    height: 282px;
    width: 100%;
    background-color: var(--bg-skeleton-dark);
    left: 0;
  }

  &.dark {
    &::after {
      background: linear-gradient(to left, rgba(255, 255, 255, 0), rgba(#fff, 0.2), rgba(255, 255, 255, 0));
    }
  }

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

  &-top {
    position: relative;
    z-index: 1;

    span {
      display: inline-block;
      background: var(--bg-skeleton-light);

      &:first-child {
        width: 102px;
        height: 32px;
        margin-bottom: 16px;
      }

      &:last-child {
        width: 100%;
        height: 48px;
        margin-top: 32px;
      }
    }

    >div {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        margin: 0 !important;

        &:first-child {
          width: 294px;
          height: 62px;
        }

        &:last-child {
          width: 30px;
          height: 26px;
        }
      }
    }
  }

  &-middle {
    position: relative;
    z-index: 1;
    padding: 30px;
    background: var(--bg-skeleton-dark);
    margin-top: 28px;

    .top {
      display: flex;
      justify-content: space-between;

      li {
        width: 112px;
        height: 40px;
        background: var(--bg-skeleton-light);
        position: relative;

        &:after {
          content: '';
          width: 2px;
          height: 40px;
          position: absolute;
          right: -30px;
          background: var(--bg-skeleton-light);
        }

        &:last-child {
          &:after {
            display: none;
          }
        }
      }
    }

    .middle {
      display: flex;
      justify-content: space-between;
      margin-top: 26px;

      li {
        width: 130px;
        height: 60px;
        border-radius: 30px;
        background: var(--bg-skeleton-light);
      }
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 22px;

      >div {
        display: flex;

        span {
          display: inline-block;
          background: var(--bg-skeleton-light);
          height: 40px;

          &:first-child {
            width: 28px;
          }

          &:last-child {
            width: 124px;
            margin-left: 14px;
          }
        }
      }

      >span {
        display: inline-block;
        background: var(--bg-skeleton-light);
        height: 40px;
        width: 28px;
      }
    }
  }

  &-bottom {
    li {
      background: var(--bg-skeleton-dark);
      margin-top: 26px;
      border-radius: 12px;

      .top {
        padding: 26px 16px 14px;
        border-bottom: 2px solid var(--bg-skeleton-light);

        >div {
          &:first-child {
            display: flex;
            justify-content: space-between;
            margin-bottom: 36px;

            >div {
              display: flex;

              span {
                display: inline-block;
                height: 28px;
                background: var(--bg-skeleton-light);

                &:first-child {
                  width: 28px;
                }

                &:last-child {
                  width: 140px;
                  margin-left: 12px;
                }
              }
            }

            >span {
              display: inline-block;
              height: 28px;
              width: 28px;
              background: var(--bg-skeleton-light);
            }
          }

          &:last-child {
            display: flex;
            justify-content: space-between;

            span {
              display: inline-block;
              background-color: var(--bg-skeleton-light);
              height: 22px;

              &:first-child {
                width: 58px;
              }

              &:nth-child(2) {
                width: 22px;
              }

              &:nth-child(3),
              &:nth-child(4),
              &:nth-child(5) {
                width: 40px;
              }

              &:last-child {
                width: 66px;
              }
            }
          }
        }
      }

      .bottom {
        padding: 36px 16px 26px;

        ul {
          li {
            margin-top: 0 !important;
            display: flex;
            justify-content: space-between;
            margin-bottom: 26px;

            &:last-child {
              margin-bottom: 0;
            }

            span {
              display: inline-block;
              background-color: var(--bg-skeleton-light);
              height: 28px;

              &:first-child,
              &:nth-child(3) {
                width: 28px;
              }

              &:nth-child(2) {
                width: 140px;
              }

              &:nth-child(4) {
                width: 148px;
              }

              &:last-child {
                width: 160px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
