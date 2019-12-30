<template>
  <div class="el-image">
    <a
      v-if="$slots.default"
      v-bind="$attrs"
      v-on="$listeners"
      @click="clickHandler"
    >
      <slot></slot>
    </a>
    <img
      v-else
      class="el-image__inner"
      v-bind="$attrs"
      v-on="$listeners"
      @click="clickHandler"
      :src="thisSrc"
      :style="imageStyle"
      :class="{ 'el-image__inner--center': alignCenter, 'el-image__preview': preview }"
    >
    <image-viewer
      v-if="showImageViewer"
      :z-index="zIndex"
      :on-close="closeViewer"
      :url-list="$slots.default ? [thisSrc] : previewSrcList"
    />
  </div>
</template>

<script>
import Image from 'element-ui/lib/image';

export default {
  extends: Image,

  data() {
    return {
      thisSrc: ''
    };
  },

  props: {
    src: [File, String]
  },

  computed: {
    showImageViewer() {
      return this.preview && this.showViewer;
    },

    preview() {
      const { previewSrcList } = this;
      if (this.$slots.default) return true;
      return Array.isArray(previewSrcList) && previewSrcList.length > 0;
    }
  },

  watch: {
    showImageViewer(val) {
      this.$emit('showImageViewer', val);
    },

    src(val) {
      this.urlToString(val).then(src => {
        this.thisSrc = src;
        this.show && this.loadImage();
      });
    }
  },

  methods: {
    // 如果传过来是文件，需要转base64
    urlToString(src) {
      return new Promise((resolve, reject) => {
        if (typeof src === 'string') return resolve(src);

        let reader = new FileReader();
        let imgResult;
        reader.readAsDataURL(src);
        reader.onload = () => { imgResult = reader.result; };

        reader.onerror = error => {
          console.error('文件转base64失败！');
          reject(error);
        };

        reader.onloadend = () => resolve(imgResult);
      });
    }
  },

  mounted() {
    this.urlToString(this.src).then(src => { this.thisSrc = src; });
  }
};
</script>