<template>
  <main class="line-up-tab-wrap">
    <section class="team-vs-wrap">
      <div class="team">
        <img src alt />
        <span>xxx{{$t('队')}}</span>
      </div>

      <div class="vs-wrap">
        <span>{{$t('主队')}}</span>
        <img :src="$getSrc('/src/assets/native-sports/images/VS@2x.png')" alt />
        <span>{{$t('客队')}}</span>
      </div>

      <div class="team">
        <img src alt />
        <span>xxx{{$t('队')}}</span>
      </div>
    </section>

    <section class="tab-body">
      <header>
        <span>4-4-1</span>
        <span>4-4-1</span>
      </header>

      <div class="line-up-table">
        <div class="line-up-item">
          <div class="left-team team">
            <div>
              <span>1</span>
            </div>
            <span>H.Durose</span>
          </div>
          <div class="right-team team">
            <div>
              <span>1</span>
            </div>
            <span>H.Durose</span>
          </div>
        </div>
        <div class="line-up-item">
          <div class="left-team team">
            <div>
              <span>1</span>
            </div>
            <span>H.Durose</span>
          </div>
          <div class="right-team team">
            <div>
              <span>1</span>
            </div>
            <span>H.Durose</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup></script>

<style lang="less" scoped>
.line-up-tab-wrap {
  margin-top: 20px;
  background-color: var(--card-bg-color, var(--bg-color-fff));
  flex: 1;
  padding-top: 24px;
}

.team-vs-wrap {
  display: flex;
  justify-content: center;
  padding-left: 38px;
  padding-right: 40px;
  align-items: center;
  height: 60px;

  .team {
    display: flex;
    width: 200px;
    font-size: 24px;
    font-weight: 500;
    color: var(--dark-fff, var(--font-color-252525));

    &:last-child {
      flex-direction: row-reverse;
      justify-content: flex-start;
    }

    img {
      width: 28px;
      margin-right: 14px;
    }
  }

  .vs-wrap {
    width: 212px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    border-radius: 10px;
    border: 2px solid var(--font-color-252525);
    font-size: 24px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-252525));
    overflow: visible;
    position: relative;
    padding: 0 16px;

    img {
      width: 58px;
      height: 34px;
      left: 50%;
      transform: translateX(-50%);
      position: absolute;
    }
  }
}

.tab-body {
  margin-top: 16px;

  header {
    height: 52px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28px;
    color: var(--dark-fff, var(--font-color-252525));
    padding: 0 24px;
    box-sizing: border-box;
    border-left: solid 10px var(--theme-color);
    border-right: solid 10px var(--font-color-252525);
  }

  .line-up-table {
    .line-up-item {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 38px;
      &:nth-child(odd) {
        background: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
      }

      .team {
        display: inline-flex;
        align-items: center;
        width: 50%;
        height: 100%;

        div:first-child {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100%;
          border: 2px solid var(--theme-color);
          color: var(--theme-color);
          font-size: 28px;
          margin-right: 22px;
          span {
            color: var(--theme-color);
          }
        }

        &.right-team {
          flex-direction: row-reverse;
          box-sizing: border-box;
          border-left: solid 2px var(--dark-4E4C5D, var(--bg-color-e6ebf1));
          div:first-child {
            border-color: var(--dark-fff, var(--font-color-252525));
            margin-right: 0px;
            margin-left: 22px;
            span {
              color: var(--dark-fff, var(--font-color-252525));
            }
          }
        }

        span {
          font-size: 28px;
          font-weight: 500;
          color: var(--dark-fff, var(--font-color-252525));
        }
      }
    }
  }
}
</style>
