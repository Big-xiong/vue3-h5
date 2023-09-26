<template>
  <main class="analyse-tab-wrap">
    <div class="analyse-item">
      <header>
        <span class="title">{{$t('事件直播')}}</span>
        <span class="subtitle">0{{$t('胜')}}0{{$t('平')}}2{{$t('负')}}</span>
      </header>

      <div class="analyse-table">
        <div class="head">
          <div class="game">{{$t('赛事/时间')}}</div>
          <div class="house">{{$t('主队')}}</div>
          <div class="score">{{$t('比分')}}</div>
          <div class="guest">{{$t('客队')}}</div>
          <div class="result">{{$t('赛果')}}</div>
        </div>
        <div class="row">
          <div class="game">
            <span>{{$t('球会友谊')}}</span>
            <span>2021-23-32</span>
          </div>
          <div class="house">{{$t('南部海狼队')}}</div>
          <div class="score">
            <span>1-3</span>
            <span>1-3</span>
          </div>
          <div class="guest">{{$t('南部海狼队')}}</div>
          <div class="result">{{$t('负')}}</div>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="analyse-item">
      <header>
        <span class="title">{{$t('近期战绩')}}</span>
      </header>

      <div class="team-status">
        <div>
          <img src alt />
          <span>xxx{{$t('队伍')}}</span>
        </div>
        <div class="status-result">0{{$t('胜')}}0{{$t('平')}}2{{$t('负')}}</div>
      </div>

      <div class="analyse-table">
        <div class="head">
          <div class="game">{{$t('赛事/时间')}}</div>
          <div class="house">{{$t('主队')}}</div>
          <div class="score">{{$t('比分')}}</div>
          <div class="guest">{{$t('客队')}}</div>
          <div class="result">{{$t('赛果')}}</div>
        </div>
        <div class="row">
          <div class="game">
            <span>{{$t('球会友谊')}}</span>
            <span>2021-23-32</span>
          </div>
          <div class="house">{{$t('南部海狼队')}}</div>
          <div class="score">
            <span>1-3</span>
            <span>1-3</span>
          </div>
          <div class="guest">{{$t('南部海狼队')}}</div>
          <div class="result">{{$t('负')}}</div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>

</script>

<style lang="less" scoped>
.analyse-tab-wrap {
  background-color: var(--card-bg-color, var(--bg-color-fff));
  margin-top: 20px;

  .divider {
    height: 20px;
    background: var(--bg-color-F9F9F9);
  }

  .analyse-item {
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px 0 32px;
      margin-bottom: 20px;
      span.title {
        font-size: 32px;
        font-weight: 500;
        color: var(--dark-fff, var(--font-color-252525));
      }
      span.subtitle {
        font-size: 28px;
        color: #848a9a;
      }
    }
  }

  .analyse-table {
    .game {
      width: 186px;
    }
    .house {
      width: 180px;
    }
    .score {
      width: 96px;
    }
    .guest {
      width: 168px;
    }
    .result {
      width: 112px;
    }

    .head {
      height: 52px;
    }

    .head,
    .row {
      display: flex;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-sizing: border-box;
      }
    }

    .head {
      background: var(--dark-31303C, var(--bg-color-F9F9F9));
      div {
        color: #848a9a;
      }
    }

    .row {
      &:not(:last-child) {
        border-bottom: solid 2px var(--dark-4E4C5D, var(--bg-color-e6ebf1));
      }
      div {
        color: var(--dark-fff, var(--font-color-252525));
        &:not(:last-child) {
          border-right: solid 2px var(--dark-4E4C5D, var(--bg-color-e6ebf1));
        }
      }
      .house,
      .result {
        color: var(--theme-color) !important;
      }
    }

    .game {
      flex-direction: column;
      align-items: flex-start !important;
      padding-left: 34px;
      padding-top: 10px;
      padding-bottom: 10px;
    }

    .score {
      flex-direction: column;
    }
  }

  .team-status {
    background-color: var(--bg-color-F9F9F9);
    height: 76px;
    display: flex;
    align-items: center;
    padding-left: 32px;
    padding-right: 40px;
    justify-content: space-between;
    font-size: 24px;
    font-weight: 500;
    color: var(--dark-fff, var(--font-color-252525));
    line-height: 34px;

    img {
      width: 28px;
      height: 26px;
      margin-right: 14px;
    }

    .status-result {
      color: #848a9a;
    }
  }
}
</style>
