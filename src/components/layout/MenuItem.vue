<template>
  <div>
    <el-submenu
      v-if="item.children && item.children.length"
      :index="item.path"
    >
      <template slot="title">
        <i
          class="icon iconfont"
          :class="[item.icon]"
        />
        <span
          slot="title"
          :class="{hide: isCollapse}"
        >{{ item.title }}</span>
      </template>
      <template v-for="(child, index) in item.children">
        <menu-item
          v-if="child.children && child.children.length && child.hasAuthority"
          :item="child"
          :key="index"
        ></menu-item>
        <el-menu-item
          v-else-if="child.hasAuthority"
          :key="index"
          :index="child.path"
        >
          <i
            class="icon iconfont"
            :class="[child.icon]"
          />
          <span slot="title">{{ child.title }}</span>
        </el-menu-item>
      </template>
    </el-submenu>
    <el-menu-item
      v-else
      :index="item.path"
      @click.native="$emit('menu-item-click', item)"
    >
      <i
        class="icon iconfont"
        :class="[item.icon]"
      />
      <span slot="title">{{ item.title }}</span>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',

  props: {
    item: {
      type: Object,
      required: true
    },

    isCollapse: {
      type: Boolean,
      default: false
    }
  }
};
</script>