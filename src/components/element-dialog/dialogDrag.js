import { isObj } from '@/util/utils.js';
export default {
  bind(el, binding, vnode, oldVnode) {
    if (isObj(binding.value) && binding.value.canDrag === false) return;
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');
    if (!dialogHeaderEl || !dragDom) return;
    dialogHeaderEl.style.cursor = 'move';
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;
      const screenWidth = document.body.clientWidth;
      const screenHeight = document.documentElement.clientHeight;
      const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
      const dragDomheight = dragDom.offsetHeight; // 对话框高度
      const minDragDomLeft = dragDom.offsetLeft;
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
      const minDragDomTop = dragDom.offsetTop;
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;
      // 获取到的值带px 正则匹配替换
      let styL;
      let styT;
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/%/g, '') / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100);
      } else {
        styL = +sty.left.replace(/px/g, '') || 0;
        styT = +sty.top.replace(/px/g, '') || 0;
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离 
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 是否处理边界处理, 默认处理； 可以配置 binding.value.handlingBorders = false 不处理
        if (!isObj(binding.value) || binding.value.handlingBorders !== false) {
          if (-(left) > minDragDomLeft) {
            left = -(minDragDomLeft);
          } else if (left > maxDragDomLeft) {
            left = maxDragDomLeft;
          }

          if (-(top) > minDragDomTop) {
            top = -(minDragDomTop);
          } else if (top > maxDragDomTop) {
            top = maxDragDomTop;
          }
        }

        // 移动当前元素
        dragDom.style.left = `${left + styL}px`;
        dragDom.style.top = `${top + styT}px`;
      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
};