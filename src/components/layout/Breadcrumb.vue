<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <template v-for="(item, index) in breadRecord">
      <el-breadcrumb-item
        :key="index"
        :to="{ path: item.path }"
      >
        {{ item.title }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      breadRecord: []
    };
  },

  computed: {
    ...mapGetters([
      'menuList',
      'allMenu'
    ])
  },

  methods: {
    initSessionStorage() {
      sessionStorage.setItem('__breadRecord__', JSON.stringify(this.breadRecord));
    },

    initBreadRecord(breadRecord) {
      try {
        this.breadRecord = breadRecord || JSON.parse(sessionStorage.getItem('__breadRecord__')) || [];
        this.initSessionStorage();
      } catch (e) { this.breadRecord = []; }
    },

    pushBreadRecord(breadRecordItem) {
      this.breadRecord.push(breadRecordItem);
      this.initSessionStorage();
    },

    spliceBreadCrumb(index) {
      this.breadRecord.splice(index);
      this.initSessionStorage();
    },

    // 更新路由的时候会调用该方法
    beforeRouteUpdate(to) {
      const path = to.path;
      if (path === '/404') return this.spliceBreadCrumb(0);

      // 点击浏览器后退，或者点击面包屑跳转，要更新
      let index = this.breadRecord.findIndex(item => item.path === to.path);
      if (index > 0) return this.spliceBreadCrumb(index + 1);

      // 确保是左侧栏页面菜单的跳转
      let pathItem = this.allMenu.find(item => item.path === to.path);
      if (pathItem) this.initBreadRecord([{ path: pathItem.path, title: pathItem.title }]);
    }
  },

  mounted() {
    if (this.$route.path === '/') {
      this.spliceBreadCrumb(0);
    } else {
      this.initBreadRecord();
    }

    // 页面跳转$_goPage 可能触发 pushBreadRecord
    this.$root.$on('pushBreadRecord', this.pushBreadRecord);
  }
};
</script>