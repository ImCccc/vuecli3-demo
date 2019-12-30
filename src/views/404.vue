<template>
  <div class="center">
    <img :src="require('@/assets/images/404.png')">
    <el-button
      round
      class="back"
      @click="$router.go(-1)"
    >返回</el-button>
  </div>
</template>

<style lang="scss" scoped>
.center {
  top: 50%;
  left: 50%;
  position: absolute;
  text-align: center;
  transform: translate(-50%, -50%);

  .back {
    position: absolute;
    right: 200px;
    right: 0px;
    width: 100px;
    bottom: 0px;
  }
}
</style>