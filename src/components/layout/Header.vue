<template>
  <el-header
    height="50px"
    class="header"
  >
    <div class="header__left">
      <i
        class="header__fold"
        :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
        @click="$emit('updateCollapse')"
      ></i>
      <!-- 面包屑 -->
      <breadcrumb ref="breadcrumbRef" />
    </div>
    <div>
      <!-- <full-screen></full-screen> -->
      <span style="margin-right: 20px; font-size: 14px;">admin</span>
      <el-dropdown @command="handleCommand">
        <el-avatar
          size="medium"
          icon="el-icon-user-solid"
        ></el-avatar>
        <el-dropdown-menu
          slot="dropdown"
          class="header__dropdown"
        >
          <el-dropdown-item
            v-for="item in dropdownItems"
            :key="item.command"
            :icon="item.icon"
            :disabled="item.disabled"
            :command="item.command"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import Breadcrumb from './Breadcrumb.vue';

export default {
  data() {
    return {
      dropdownItems: [
        {
          label: '登出',
          command: 'loginOut',
          icon: 'icon iconfont icon-loginOut'
        }
      ]
    };
  },

  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },

  components: {
    Breadcrumb
  },

  methods: {
    handleDropdown(command) {
      this.thisCustomer = command;
    },

    updateBreadRecord(route) {
      try { this.$refs.breadcrumbRef.beforeRouteUpdate(route); } catch (e) { }
    },

    handleCommand(command) {
      if (command === 'loginOut') {
        localStorage.removeItem('token');
        this.$_goPage('/login');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  @include flexBetween();

  &__left {
    display: flex;
    align-items: center;
  }

  &__fold {
    cursor: pointer;
    margin-right: 10px;
    font-size: $font-size-extra-large;
  }

  &__dropdown {
    /deep/ .el-dropdown-menu__item {
      display: flex;
    }
  }
}
</style>
