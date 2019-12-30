<template>
  <el-container class="container">
    <Aside
      :isCollapse="isCollapse"
      :defaultActive="defaultActive"
    />
    <el-container
      v-loading="!initDataSuccess"
      class="container__body"
    >
      <Header
        ref="headerRef"
        :isCollapse="isCollapse"
        @updateCollapse="isCollapse = !isCollapse"
      />
      <el-main
        v-if="initDataSuccess"
        class="container__main"
      >
        <keep-alive>
          <router-view
            class="container__content"
            v-if="$route.meta.keepAlive"
          ></router-view>
        </keep-alive>
        <router-view
          class="container__content"
          v-if="!$route.meta.keepAlive"
        ></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Aside from '@/components/layout/Aside.vue';
import Header from '@/components/layout/Header.vue';

export default {
  data() {
    return {
      defaultActive: '',
      initDataSuccess: false,
      isCollapse: false // 菜单是否折叠
    };
  },

  computed: {
    ...mapGetters(['allMenu'])
  },

  components: {
    Aside,
    Header
  },

  // 路由跳转需要更新面包屑
  beforeRouteUpdate(to, from, next) {
    const path = to.path;

    // 确保是左侧栏页面菜单的跳转
    if (this.allMenu.find(item => item.path === path)) this.defaultActive = path;

    // 更新面包屑
    this.$refs.headerRef.updateBreadRecord(to);
    next();
  },

  methods: {
    ...mapActions(['initSource'])
  },

  mounted() {
    // 获取数据字典数据
    this.initSource().then(() => { this.initDataSuccess = true; });
    this.defaultActive = this.$route.meta && this.$route.meta.menuEntry
      ? this.$route.meta.menuEntry : this.$route.path;
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;

  &__body {
    width: 100%;
    flex-direction: column;
    background: #edf3f7;
  }

  &__main {
    @include flexColumn();
    padding: 10px 30px 20px;
  }

  /deep/ .el-header {
    padding: 0 30px;
  }
}
</style>
