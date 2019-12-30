<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-dialogDrag="dragOptions"
      v-show="visible"
      class="el-dialog__wrapper"
      @click.self="handleWrapperClick"
    >
      <div
        role="dialog"
        :key="key"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="['el-dialog', { 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
        ref="dialog"
        :style="style"
      >
        <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div
          class="el-dialog__body"
          v-if="rendered"
        >
          <slot></slot>
        </div>
        <div
          class="el-dialog__footer"
          v-if="$slots.footer"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import dialogDrag from './dialogDrag.js';
import ElDialog from 'element-ui/lib/dialog';

export default {
  name: 'ElDialog',
  extends: ElDialog,

  directives: {
    dialogDrag
  },

  props: {
    dragOptions: {
      type: Object,
      default: _ => ({
        canDrag: true, // 配置 能否拖动
        isRestorePosition: true, // 重新打开是否还原位置
        handlingBorders: false // 配置 是否处理边界
      })
    }
  },

  created() {
    // 关闭弹窗，还原位置
    if (this.dragOptions.isRestorePosition === false) return;
    this.$watch('visible', val => {
      if (val) return;

      setTimeout(_ => {
        let dragDom = this.$refs.dialog;
        dragDom.style.left = '';
        dragDom.style.top = '';
      }, 300);
    });
  }
};
</script>
