<template>
  <div class="rocket">
    <div class="circle"></div>
    <div class="ship">
      <i class="iconfont icon-rocket"></i>
    </div>
  </div>
</template>

<style lang="less" scoped>
@width: 298px;

.rocket {
  width: @width;
  height: @width;
  position: relative;
  margin: 0 auto;
}

.ship,
.circle {
  width: 50%;
  height: 50%;
  position: absolute;
  left: 25%;
  top: 25%;
  will-change: transform;
}

.circle {
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 90%;
    height: 90%;
    left: 5%;
    top: 5%;
    background-color: var(--theme-color);
    border-radius: 50%;
  }

  &::before {
    animation: circle1 1.2s linear infinite;
  }

  &::after {
    animation: circle2 1.2s linear infinite;
  }
}

.ship {
  padding: 12.5%;
  border-radius: 50%;
  box-sizing: border-box;
  background-color: var(--theme-color);

  img {
    display: block;
    width: 100%;
  }

  .iconfont {
    position: absolute;
    left: 25%;
    top: 25%;
    color: var(--font-color-fff);
    animation: rocket 1s alternate infinite linear;
    font-size: 75px;
  }
}
@keyframes circle1 {
  to {
    transform: scale(1.8);
    opacity: 0;
  }
}
@keyframes circle2 {
  to {
    transform: scale(2.2);
    opacity: 0;
  }
}
@keyframes rocket {
  from {
    transform: translate(-3px, 2px);
  }

  to {
    transform: translate(2px, -3px);
  }
}
</style>
