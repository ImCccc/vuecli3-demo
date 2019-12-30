<template>
  <el-tooltip
    :content="isFullScreen ? '退出全屏' : '全屏'"
    placement="left-start"
  >
    <span
      class="icon iconfont full"
      :class="[isFullScreen ? 'icon-exitScreen' : 'icon-fullScreen']"
      @click="screen"
    ></span>
  </el-tooltip>
</template>

<script>
export default {
  data() {
    return {
      isFullScreen: false
    };
  },

  methods: {
    screen() {
      this.isFullScreen ? this.exitScreen() : this.fullScreen();
    },

    fullscreenchange() {
      document.addEventListener('fullscreenchange', e => (this.isFullScreen = document.fullscreen));
      document.addEventListener('mozfullscreenchange', e => (this.isFullScreen = document.mozFullScreen));
      document.addEventListener('msfullscreenchange', e => (this.isFullScreen = document.msFullscreenElement));
      document.addEventListener('webkitfullscreenchange', e => (this.isFullScreen = document.webkitIsFullScreen));
    },

    fullScreen() {
      const el = document.documentElement;
      const rfs =
        el.requestFullScreen ||
        el.msRequestFullscreen ||
        el.mozRequestFullScreen ||
        el.webkitRequestFullScreen;
      rfs.call(el);
    },

    exitScreen() {
      if (document.exitFullscreen) return document.exitFullscreen();
      if (document.msExitFullscreen) return document.msExitFullscreen();
      if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
      if (document.webkitCancelFullScreen) return document.webkitCancelFullScreen();
    }
  },

  mounted() {
    this.fullscreenchange();
  }
};
</script>

<style lang="scss" scoped>
.full {
  cursor: pointer;
  font-size: $font-size-large;
  margin-right: 14px;
}
</style>
