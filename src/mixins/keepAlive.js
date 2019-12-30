import { clone, isFun } from '@/util/utils.js';
export default {
  created() {
    this.__firstEntry__ = true;
  },

  activated() {
    // 第一次进来 直接返回
    if (this.__firstEntry__) {
      this.__firstEntry__ = false;
      return;
    }

    // 上一个页面 setParams({ keepAliveInit: true }) 调用 keepAliveInit
    if (this.$_getParams('keepAliveInit') && isFun(this.keepAliveInit)) {
      this.keepAliveInit(this.$getParams('initOptions'));
      return;
    }

    // 判断是否需要还原滚动条
    if (isFun(this.$_restoreScrollBar)) {
      this.$_restoreScrollBar();
    }

    if (isFun(this.keepAliveUse)) {
      this.keepAliveUse();
    }
  },
  methods: {
    keepAliveInitData(data) {
      for (let k in data) {
        this[k] = clone(data[k]);
      }
    }
  }
};
