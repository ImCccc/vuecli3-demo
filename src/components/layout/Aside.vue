<template>
  <el-menu
    class="aside"
    @select="selectMenu"
    :collapse="isCollapse"
    :default-active="defaultActive"
  >
    <template v-for="(menu, index) in menuList">
      <menu-item
        class="aside__menu"
        v-if="menu.hasAuthority"
        :item="menu"
        :key="index"
        :isCollapse="isCollapse"
      ></menu-item>
    </template>
  </el-menu>
</template>

<script>
import MenuItem from './MenuItem.vue';
import { menuList } from '@/util/config.js';
import { isArrObj } from '@/util/utils.js';
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      // 当前登录人的权限，权限越高，数值就越大
      authority: 0,
    };
  },

  computed: {
    ...mapGetters(['menuList']),
  },

  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },

    defaultActive: {
      type: String,
      default: ''
    }
  },

  components: {
    MenuItem
  },

  methods: {
    ...mapMutations({
      setMenuList: 'SET_MENULIST'
    }),

    selectMenu(path) {
      if (this.$route.path === path) return;
      this.$_goPage(path);
    },

    filterMenuList(menuList) {
      return menuList;
    },

    initMenu() {
      const loop = (list, parent) => {
        list.forEach(item => {
          let { children, authority } = item;
          // hasAuthority 会决定左侧菜单栏是否显示
          item.hasAuthority = this.authority >= authority;
          if (isArrObj(children)) loop(children);
        });
      };

      loop(menuList);
      this.setMenuList(menuList);
    }
  },

  mounted() {
    this.authority = 0;
    this.initMenu();
  }
};
</script>

<style lang="scss" scoped>
.aside {
  height: 100%;
  flex-shrink: 0;
  overflow: auto;
  border-right: none;
  background-color: $menu-background-color;

  /deep/ &__menu {
    .el-menu {
      background-color: $menu-background-color;
    }

    .el-menu-item,
    .el-submenu__title {
      font-size: $menu-item-font-size;
      color: $menu-item-font-color !important ;

      .el-submenu__icon-arrow {
        color: $menu-item-font-color !important ;
      }

      .iconfont {
        display: inline-block;
        width: 24px;
        margin-right: 5px;
        color: inherit;
        font-size: $menu-item-font-size-icon;
      }
    }

    // 激活菜单的背景颜色
    .el-menu-item.is-active {
      color: $menu-item-font-color-active !important ;
      background-color: $menu-background-color-active !important;
    }

    .el-menu-item:hover,
    .el-submenu__title:hover {
      background-color: $menu-item-hover;
    }

    .el-menu-item:hover,
    .el-submenu__title:hover {
      background-color: $menu-item-hover;
    }
  }

  &:not(.el-menu--collapse) {
    width: $menu-width;
  }
}
</style>
