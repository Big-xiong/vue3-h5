<template>
    <div class="container container-wrap">
      <van-nav-bar
      :title="$t('页面错误')"
      @click-left="$router.go(-1)"
      left-arrow
      ></van-nav-bar>
        <div class="main">
            <div class="errorImg">
                <img :src="$getSrc('/src/assets/images/error/403.png')" alt=""/>
            </div>
            <div class="text">
                <p class="code">{{$t('您访问的页面不存在')}}</p>
                <div class="chinese">
                   {{$t('您访问的页面已丢失，导致您所尝试的页面无法打开。 由此给你带来的不便万趣深表歉意。')}} 
                </div>
                <p class="code">Dear Customers</p>
                <div class="english">
                    The current website is under maintenance,we are temporarily
                    unable to provide services for you.We apologize for the
                    inconvenience caused.
                </div>
                <div class="aagames-button-box">
                    <button class="aagames-button" type="button" @click="$openKefu">{{$t('联系专属客服')}}    </button>
                </div>
            </div>

        </div>
    </div>
</template>
<style scoped lang="less">
 .container {
    position:relative;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    background: var(--bg-color-white);
    :deep(.aagames-nav-bar){
        background:transparent;
    }
    .main {
      // margin-top: @main-margin-top;
      width:100%;
      height: 100%;
      position: absolute;
      left:50%;
      top:50%;
      transform:translateX(-50%) translateY(-50%);
      display:flex;
      flex-direction: column;
      justify-content: center;
      align-items:center;
      padding: 0 32px;
      box-sizing: border-box;
      .errorImg {
        margin: 0 auto;
        width: 546px;
        img{
            width:100%;
        }
      }
      .text {
        text-align: left;
        .code {
          margin-top: 20px;
          font-size: 32px;
          font-weight: 600;
          color:var(--font-color-2b2b2b);
          line-height: 44px;
        }
        .chinese {
          margin-top: 18px;
          font-size: 28px;
          font-weight: 400;
          color:var(--font-color-999999);
          line-height: 44px;
        }
        .english {
          margin-top: 20px;
          font-size: 28px;
          font-weight: 400;
          color:var(--font-color-999999);
          line-height: 40px;
        }
        .aagames-button-box .aagames-button{
          margin-top: 98px;
          width: 340px;
          height: 100px;
          background: var(--bg-color-00a0b0);
          font-size: 32px;
          font-weight: 600;
          text-align: center;
          color:var(--font-color-ffffff);
          line-height: 48px;
          border-radius: 8px;
        }
      }

    }
  }

</style>
