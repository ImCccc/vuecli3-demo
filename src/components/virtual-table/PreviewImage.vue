<template>
  <div
    class="image"
    v-if="src"
  >
    <el-image
      ref="imageRef"
      :src="src"
      :preview-src-list="[src]"
    ></el-image>
  </div>
</template>

<script>
export default {
  data() {
    return {
      src: ''
    };
  },

  methods: {
    show(src) {
      this.src = src;
      this.$nextTick(_ => {
        this.$refs.imageRef.clickHandler();
      });
    },

    hide() {
      this.src = '';
    }
  },
};
</script>
<style lang="scss" scoped>
// 只是全屏预览，所以要隐藏下面样式
.image {
  /deep/ .el-image__inner.el-image__preview {
    display: none;
  }
}
</style>