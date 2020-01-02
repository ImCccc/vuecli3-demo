<template>
  <div
    class="container"
    :style="containerStyle"
  >
    <el-table
      border
      ref="table"
      v-bind="$attrs"
      v-on="$listeners"
      :data="showList"
      :height="tableHeight"
    >
      <template v-for="(col, index) in cols">
        <!-- 多选 -->
        <el-table-column
          v-if="col.type === 'selection'"
          align='center'
          :key="index"
          :width="col.width || 55"
        >
          <template slot="header">
            <select-all
              class="table-column--selection"
              ref="selectAllRef"
              @change="selectAllChange"
            ></select-all>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              class="table-column--selection"
              v-model="scope.row[col.prop]"
              @change="selectRowChange"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          v-bind="col"
          :key="index"
          :show-overflow-tooltip="col.showOverflowTooltip !== false"
        >
          <template slot-scope="scope">
            <!-- 点击需要触发事件 -->
            <a
              v-if="col.type === 'oper' && !col.vHtml"
              @click="$emit(col.eventName, scope, $event)"
            >{{ _getText(col, scope) }}</a>
            <!-- 点击需要触发事件需要生成一定的样式，例如添加图标，那么需要使用formatter返回html模板 -->
            <a
              v-else-if="col.type === 'oper'"
              v-html="_getText(col, scope)"
              @click="$emit(col.eventName, scope, $event)"
            ></a>
            <!-- 日期 -->
            <template v-else-if="col.type ==='date'">
              {{  scope.row[col.prop] | formatDate(col.dateFormat) }}
            </template>
            <!-- 图片 -->
            <el-image
              v-else-if="col.type === 'picture' && scope.row[col.prop]"
              :src="scope.row[col.prop]"
              :style="col.imageStyle || imageDefaultStyle"
              :preview-src-list="_getPreviewSrcList(col, scope)"
            ></el-image>
            <!-- 显示html方式，通常用于显示文本 -->
            <div
              v-else-if="col.vHtml"
              v-html="_getText(col, scope)"
            ></div>
            <!-- 操作 -->
            <div
              v-else-if="col.type === 'iconOper'"
              :class="[col.lists.length > 1 ? 'flexBetween' : 'flexCenter']"
            >
              <template v-for="oper in col.lists">
                <el-tooltip
                  v-if="oper.icon"
                  :key="oper.type"
                  :content="oper.title"
                >
                  <i
                    :class="['icon', 'iconfont', oper.icon]"
                    :style="oper.styleMethod ? oper.styleMethod(scope.row) : oper.style"
                    @click="$emit('operationClick', oper.type, scope)"
                  ></i>
                </el-tooltip>
                <el-button
                  v-else
                  type="text"
                  size="small"
                  :key="oper.type"
                  @click="$emit('operationClick', oper.type, scope)"
                >{{ oper.title }}</el-button>
              </template>
            </div>
            <template v-else>
              {{ _getText(col, scope) }}
            </template>
          </template>
        </el-table-column>
      </template>
      <div
        v-if="!useVirtualScroll"
        :style="placeholderHeight"
        slot="append"
      ></div>
    </el-table>
  </div>
</template>

<script>
import { clone } from '@/util/utils.js';
import SelectAll from './SelectAll.vue';

export default {
  data() {
    return {
      scrollTop: 0,
      // 列表显示图片的宽高
      imageDefaultStyle: 'width: 60px; height: 60px',
    };
  },

  props: {
    // 显示的数据
    list: {
      type: Array,
      default: () => []
    },

    // 表头数据 参考 element-ui table组件的 Table-column Attributes
    cols: {
      type: Array,
      default: () => []
    },

    // 页面上dom数量
    domNumber: {
      type: Number,
      default: 30
    },

    // 列表行的高度
    trHeight: {
      type: Number,
      default: 44
    },

    // 数据量超过多少，需要做滚动更新
    maxNumber: {
      type: Number,
      default: 200
    },

    // 容器的style拓展
    containerStyle: {
      type: Object,
      default: () => ({})
    },

    tableHeight: {
      type: String,
      default: '100%'
    }
  },

  computed: {
    listLength() {
      return this.list.length;
    },

    // 当前显示的dom元素
    showList() {
      if (this.useVirtualScroll) return this.list;
      let s = Math.floor(this.scrollTop / this.trHeight);
      let e = s + this.domNumber;
      return this.list.slice(s, e);
    },

    // 是否显示全部数据， 超过一百条数据，才会显示下拉刷新效果
    useVirtualScroll() {
      return this.listLength <= this.maxNumber;
    },

    // 补全的高度
    placeholderHeight() {
      let len = this.listLength;
      let h = len > this.domNumber ? (len - this.domNumber) * this.trHeight : 0;
      return { height: `${h}px` };
    },

    // 滚动到最后一个元素的 ScrollTop
    lastScrollTop() {
      return Math.max(0, (this.listLength - this.domNumber) * this.trHeight);
    },

    // 位移的样式
    translateY() {
      let len = this.listLength;
      return `translateY(${len > this.domNumber ? this.scrollTop : 0}px)`;
    },

    selectionProp() {
      return this.cols.find(c => c.type === 'selection').prop;
    }
  },

  components: {
    SelectAll
  },

  watch: {
    translateY(val) {
      try {
        this._tableBody = this._tableBody || this._scrollWrap.querySelector('.el-table__body');
        this._tableBody.style.transform = val;
      } catch (e) { }
    },

    // 外部的数据发生变化，需要重新判断是否实现优化列表
    useVirtualScroll(val) {
      if (!val) this.onscroll();
    }
  },

  methods: {
    // 选择所有, 选中的时候需要手动添加选中样式，不然没有选中的勾勾样式，不知道为什么
    selectAllChange(val) {
      this.isSelectAll = val;

      // 手动选中或者取消选中所有列的数据
      let prop = this.selectionProp;
      this.list.forEach(item => { item[prop] = val; });

      // 当前选中的数量
      this._selectNumber = val ? this.list.length : 0;
    },

    selectRowChange(val) {
      this._selectAllRef = this._selectAllRef || this.$refs.selectAllRef[0];

      if (val) {
        // 当前选中的数量加1
        this._selectNumber++;

        // 当前是全选状态，但是全选未勾选
        if (this._selectNumber === this.list.length) {
          this._selectAllRef.check();
        }
      } else {
        // 当前选中的数量减1
        this._selectNumber--;
        this._selectAllRef.uncheck();
      }
    },

    // 获取选中的数据
    getSelectionData() {
      let prop = this.selectionProp;
      if (!prop) return [];
      let selectionData = this.list.filter(v => v[prop]);
      return clone(selectionData);
    },

    onscroll() {
      try {
        this._scrollWrap = this._scrollWrap || this.$refs.table.$el.querySelector('.el-table__body-wrapper');
        this._scrollWrap.onscroll = (e) => {
          let target = e.target;
          if (this.useVirtualScroll) return;
          let scrollTop = target.scrollTop;
          this.scrollTop = Math.min(scrollTop, this.lastScrollTop);
        };
      } catch (e) { }
    },

    _getText(col, scope) {
      return col.formatter ? col.formatter(scope.row, scope) : scope.row[col.prop];
    },

    _getPreviewSrcList(col, scope) {
      return col.showFull !== false ? [scope.row[col.fullProp] || scope.row[col.prop]] : [];
    }
  },

  mounted() {
    this._selectNumber = 0;
    if (this.useVirtualScroll) return;
    this.onscroll();
  }
};
</script>

<style lang="scss" scoped>
.container {
  @include flexColumn();
  height: 100%;

  // 修复多选框位置偏低的bug
  /deep/ .table-column--selection .el-checkbox__input {
    display: flex;
  }

  /deep/ .icon.iconfont {
    color: $color-link;
    font-size: $font-size-large;
  }
}
</style>