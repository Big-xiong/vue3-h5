<template>
  <main class="information-tab-wrap">
    <section class="team-vs-wrap">
      <div class="team">
        <img src alt />
        <span>xxx{{$t('队')}}</span>
      </div>

      <div class="team">
        <img src alt />
        <span>xxx{{$t('队')}}</span>
      </div>
    </section>

    <section class="information-body-wrap">
      <div class="info-item good-info">
        <header>
          <span>{{$t('有利情报')}}</span>
          <span>{{$t('有利情报')}}</span>
        </header>
        <div class="info-wrap">
          <div class="left">南部海岸狼队上场足总杯客场3-0完胜芒特</div>
          <div class="right">南部海岸狼队上场足总杯客场3-0完胜芒特</div>
        </div>
      </div>
      <div class="info-item bad-info">
        <header>
          <span>{{$t('不利情报')}}</span>
          <span>{{$t('不利情报')}}</span>
        </header>
        <div class="info-wrap">
          <div class="left">南部海岸狼队上场足总杯客场3-0完胜芒特</div>
          <div class="right">南部海岸狼队上场足总杯客场3-0完胜芒特</div>
        </div>
      </div>
    </section>
  </main>
</template>

<script></script>

<style lang="less" scoped>
.information-tab-wrap {
  margin-top: 20px;
  padding-top: 32px;
  background-color: var(--card-bg-color, var(--bg-color-fff));
  flex: 1;
}

.team-vs-wrap {
  display: flex;
  justify-content: space-between;
  padding-left: 38px;
  align-items: center;
  padding-right: 40px;
  align-items: center;

  .team {
    display: flex;
    font-size: 28px;
    font-weight: 500;
    color: var(--dark-fff, var(--font-color-252525));

    &:last-child {
      flex-direction: row-reverse;
      justify-content: flex-start;
    }

    img {
      width: 44px;
      margin-right: 14px;
    }
  }
}

.information-body-wrap {
  padding: 8px 34px 40px 34px;

  .info-item {
    margin-top: 32px;
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 28px;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .info-wrap {
      display: flex;
      justify-content: space-between;
      div {
        border-radius: 12px;
        padding: 18px 16px 20px 22px;
        width: 330px;
        font-size: 24px;
        color: var(--dark-fff, var(--font-color-252525));
        line-height: 34px;
      }
    }
  }

  .good-info {
    header {
      color: #e1243b;
    }
    .info-wrap div {
      background: rgba(#e1243b, 0.05);
    }
  }

  .bad-info {
    header {
      color: #d0b393;
    }
    .info-wrap div {
      background: rgba(#d0b393, 0.05);
    }
  }
}
</style>
