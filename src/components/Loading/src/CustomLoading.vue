<template>
  <div class="snake-spinner">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
  <!-- 图标这个网站取的 https://cssfx.lovejade.cn/ -->
</template>

<style scoped>
  .snake-spinner {
    position: relative;
    width: 100px;
    height: 20px;
  }

  .snake-spinner span {
    position: absolute;
    width: 20px;
    height: 20px;
    animation: snake 1s infinite ease-in-out;
    border-radius: 20px;
    opacity: 0.5;
    background-color: #0a6770;
  }

  .snake-spinner span:nth-child(1) {
    left: 0;
    animation-delay: 0s;
  }

  .snake-spinner span:nth-child(2) {
    left: 20px;
    animation-delay: 0.2s;
  }

  .snake-spinner span:nth-child(3) {
    left: 40px;
    animation-delay: 0.4s;
  }

  .snake-spinner span:nth-child(4) {
    left: 60px;
    animation-delay: 0.6s;
  }

  .snake-spinner span:nth-child(5) {
    left: 80px;
    animation-delay: 0.8s;
  }

  @keyframes snake {
    0% {
      transform: translateY(0);
      opacity: 0.3;
      box-shadow: 0 0 3px rgb(0 0 0 / 10%);
    }

    50% {
      transform: translateY(-10px);
      opacity: 1;
      background-color: #fc2f70;
      box-shadow: 0 20px 3px rgb(0 0 0 / 5%);
    }

    100% {
      transform: translateY(0);
      opacity: 0.3;
      box-shadow: 0 0 3px rgb(0 0 0 / 10%);
    }
  }
</style>
