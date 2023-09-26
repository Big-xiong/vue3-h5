<template>
  <main class="game-status-tab-wrap">
    <div class="wether-wrap">
      <span>{{$t('温度')}}:1231</span>
      <span>{{$t('湿度')}}:1231</span>
      <span>{{$t('风速')}}:1231</span>
      <span>{{$t('气压')}}:1231</span>
    </div>

    <section class="game-progress-wrap">
      <div class="time-wrap">
        <span>0‘</span>
        <span>15‘</span>
        <span>30‘</span>
        <span>HT‘</span>
        <span>60‘</span>
        <span>75‘</span>
        <span>90‘</span>
      </div>

      <div class="divider-wrap">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="team team-a">
        <img src />
        <div class="event-wrap">
          <EventIcon style="left: 0" type="startup" class="event-item" />
        </div>
      </div>
      <div class="progress-outter">
        <div class="progress-inner"></div>
        <div class="progress-end"></div>
      </div>
      <div class="team team-b">
        <img src />
        <div class="event-wrap">
          <EventIcon />
        </div>
      </div>
    </section>

    <section class="text-event-wrap">
      <header>{{$t('事件直播')}}</header>

      <div class="event-body">
        <div class="event-item">
          <EventIcon type="startup" class="event-icon" />
          <SvgIcon class="arrow" name="sport-game_status_text_arrow" />
          <div class="team-info">
            <img src />
            海南xxx队
          </div>
          <div class="event-text">大家好，欢迎收看本场比赛直播，球员们正在</div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import EventIcon from './EventIcon.vue';
import SvgIcon from '@/components/SvgIcon.vue';
</script>

<style lang="less" scoped>
.game-status-tab-wrap {
  display: flex;
  flex-direction: column;
  width: 100vw;
  flex: 1;
}

.wether-wrap {
  height: 80px;
  background: var(--dark-111016, var(--bg-color-F9FAFB));
  display: flex;
  box-sizing: border-box;
  align-items: center;
  width: 100%;
  padding-left: 32px;
  font-size: 24px;
  font-weight: 400;
  color: var(--dark-fff, var(--font-color-252525));

  span {
    display: flex;
    align-items: center;
  }

  span:after {
    content: " ";
    width: 2px;
    height: 15px;
    background-color: #c6c6c6;
    margin: 0 12px;
    display: block;
  }
}

.game-progress-wrap {
  padding-top: 38px;
  background-color: var(--card-bg-color, var(--bg-color-fff));
  position: relative;
  height: 134px;

  .time-wrap {
    padding-left: 56px;
    display: flex;
    justify-content: space-between;
    height: 28px;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    color: var(--dark-fff, var(--font-color-252525));
    width: 644px;
    span {
      position: relative;
      overflow: visible;
      &:not(:first-child) {
        transform: translateX(10px);
      }
    }
  }

  .team {
    display: flex;
    align-items: center;
    padding-left: 20px;
    height: 24px;

    &.team-a {
      margin-top: 12px;
    }
    &.team-b {
      margin-top: 10px;
      .event-wrap {
        transform: translateY(8px);
      }
    }

    img {
      height: 24px;
      width: 24px;
      margin-right: 20px;
      border-radius: 100%;
    }

    .event-wrap {
      width: 630px;
      height: 24px;
      position: relative;

      .event-item {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .divider-wrap {
    position: absolute;
    width: 626px;
    display: flex;
    left: 62px;
    justify-content: space-between;
    height: 99px;
    top: 72px;
    span {
      display: block;
      height: 99px;
      top: 34px;
      width: 2px;
      background-color: var(--dark-4E4C5D, var(--bg-color-e6ebf1));
    }
  }

  .progress-outter {
    margin-left: 62px;
    margin-top: 10px;
    width: 622px;
    height: 6px;
    background: #f1f5f9;
    position: relative;

    .progress-inner {
      width: 50%;
      position: absolute;
      height: 100%;
      background-color: var(--theme-color);
    }
    .progress-end {
      width: 6px;
      height: 14px;
      background: #d0b393;
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.text-event-wrap {
  background-color: var(--card-bg-color, var(--bg-color-fff));
  padding-top: 46px;
  flex: 1;
  display: flex;
  flex-direction: column;

  header {
    padding-left: 42px;
    font-size: 32px;
    margin-bottom: 24px;
    font-weight: 500;
    color: var(--dark-fff, var(--font-color-252525));
    line-height: 44px;
  }

  .event-body {
    flex: 1;
    width: 716px;
    overflow-y: auto;
    border-left: solid 1px var(--dark-4E4C5D, var(--bg-color-eee));
    margin-left: auto;
    overflow: visible;

    .event-item {
      position: relative;
      border-radius: 6px;
      overflow: visible;
      width: 632px;
      height: 172px;
      background: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
      font-size: 24px;
      font-weight: 400;
      color: var(--dark-fff, var(--font-color-252525));
      line-height: 34px;
      padding: 26px 16px;
      margin-left: 42px;

      .event-icon {
        position: absolute;
        left: -42px;
        top: 72px;
      }

      .arrow {
        position: absolute;
        fill: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
        left: -14px;
        top: 70px;
        width: 14px;
        height: 32px;
      }

      .team-info {
        display: flex;
        justify-content: flex-end;

        img {
          width: 24px;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
