import keepAlive from '@/mixins/keepAlive.js';

export default {
  mixins: [keepAlive],

  methods: {
    $_saveScrollBar(tableRefStr) {
      try {
        const tableRef = this.$refs[tableRefStr];
        const scrollDom = tableRef.$el.querySelector('.el-table__body-wrapper');
        if (!scrollDom) return console.error(`找不到滚动元素 by ${scrollDom}`);
        // 保存滚动元素
        this.__scrollDom__ = scrollDom;
        let scrollTop = scrollDom.scrollTop;
        let scrollLeft = scrollDom.scrollLeft;
        // 用路由的名字来作为key ,放在windows对象里面
        let key = this.$route.fullPath.replace(/\//g, '__');
        this.__fullPath__ = key;
        window[key] = `${scrollTop},${scrollLeft}`;
      } catch (e) { }
    },

    $_restoreScrollBar() {
      try {
        let scrollP = window[this.__fullPath__].split(',');
        setTimeout(_ => {
          this.__scrollDom__.scrollTop = +scrollP[0];
          this.__scrollDom__.scrollLeft = +scrollP[1];
        }, 100);
        window[this.__fullPath__] = undefined;
      } catch (e) { }
    }
  }
};
