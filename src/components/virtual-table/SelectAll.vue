<template>
  <el-checkbox
    ref="selectRef"
    v-model="selected"
    @change="change"
  ></el-checkbox>
</template>

<script>
export default {
  data() {
    return {
      selected: false
    };
  },

  methods: {
    change(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    },

    check() {
      this.selected = true;
    },

    uncheck() {
      this.selected = false;
    }
  },
};
</script>