<template>
  <div
    class="tableList"
    ref="tableList"
    v-loading="loading"
    element-loading-background="rgba(255, 255, 255, 0.3)"
    :style="style"
  >
    <!-- v-on="$listeners" 将el-table组件能接受的自定义事件，被当前组件的父组件代理接收 -->
    <el-table
      ref="elTable"
      v-bind="$attrs"
      v-on="$listeners"
      :data="lists"
      :height="tableHeight"
      @select="selectRow"
      @select-all="selectAllRow"
    >
      <el-table-column
        v-if="expand"
        type="expand"
      >
        <template slot-scope="scope">
          <slot
            name="expand"
            v-bind="scope"
          >
          </slot>
        </template>
      </el-table-column>
      <template v-for="(col, index) in cols">
        <!-- 多选 -->
        <el-table-column
          v-if="col.type === 'selection'"
          v-bind="col"
          :width="col.width || 55"
          :key="index"
        ></el-table-column>
        <!-- 序号 -->
        <el-table-column
          v-else-if="col.type === 'index'"
          v-bind="col"
          :key="index"
          :width="col.width || 55"
          :label="col.label || '序号'"
          :index="indexMethod"
        ></el-table-column>
        <el-table-column
          v-else
          v-bind="col"
          :key="index"
          :fixed="col.fixed || false"
          :show-overflow-tooltip="col.showOverflowTooltip !== false"
        >
          <template slot-scope="scope">
            <!-- 点击需要触发事件 -->
            <a
              v-if="col.type === 'oper' && !col.vHtml"
              @click="$emit(col.eventName, scope, $event)"
            >{{ _getText(col, scope) }}</a>
            <!-- 点击需要触发事件 需要生成一定的样式，例如添加图标，那么需要使用formatter返回html模板 -->
            <a
              v-else-if="col.type === 'oper'"
              v-html="_getText(col, scope)"
              @click="$emit(col.eventName, scope, $event)"
            ></a>
            <!-- 显示html方式，通常用于显示文本 -->
            <div
              v-else-if="col.vHtml"
              v-html="_getText(col, scope)"
            ></div>
            <!-- 日期 -->
            <template v-else-if="col.type ==='date'">
              {{  scope.row[col.prop] | formatDate(col.dateFormat) }}
            </template>
            <!-- 图片 -->
            <el-image
              v-else-if="col.type === 'picture' && scope.row[col.prop]"
              :src="scope.row[col.prop]"
              :style="col.style || imageDefaultStyle"
              :preview-src-list="_getPreviewSrcList(col, scope)"
            ></el-image>
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
    </el-table>
    <div
      class="mt10 pagination"
      v-if="lists && lists.length && showPagination"
    >
      <el-pagination
        align="right"
        :total="thisPageOptions.total"
        :layout="thisPageOptions.layout"
        :page-sizes="thisPageOptions.pageSizes"
        :page-size.sync="thisPageOptions.pageSize"
        :current-page.sync="thisPageOptions.pageNumber"
        @current-change="refreshList(1)"
        @size-change="refreshList(1)"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
/**
 * 组件功能：主要将element的el-table组件和el-pagination分页组件组合一起，封装成可分页的table组件（下面称tableList）
 * 
 * Table Attributes： 
 *    table-list组件可接受el-table组件的所有Table Attributes，用法一样
 *    实现的关键：v-bind="$attrs"
 * 
 * Table Events： 
 *    table-list组件可接受el-table组件的大部分事件，用法一样
 *    实现的关键：v-on="$listeners"
 * 
 * 
 * Table-column Attributes：
 *    table-list组件的column的配置主要体现在cols的每一个元素上，可以实现el-table组件column的所有配置
 *    实现关键：v-bind="col"
 * 
 * Table拓展配置：
 *    1. expand = tru 开启展开行
 *       传递 expand = true，使用插槽的方式<template v-slot:expand="scopeProps">显示内容</template>
 *       插槽的 scopeProps，已经包含当前行row、$index 等相关信息
 *       例子：frontend/src/views/food-label/label-management/Index.vue
 * 
 *    2. showPagination 可以配置不分页
 * 
 *    3. service 请求列表接口的路径配置，或者对象
 * 
 *    4. fieldParams  查询列表的其他参数，可以在父组件动态设置该参数，达到按条件查询列表的功能
 * 
 *    5. filterParams 
 *      type: Function(参数：{ sortParams: '排序参数', pageParams：'分页参数' })
 *      说明： 重新组织查询列表的参数；每一次查询列表，都可以通过传递方法去组织参数的格式，返回的数据就是请求接口的参数
 * 
 *    6. filterList 
 *      type: Function(参数：接口返回的数据)
 *      说明： 重新组织接口返回的数据；可以以接口返回的数据为副本，重新组织列表显示的数据，
 *            该方法一般返回的数据结构是{ total: '列表总数', list: '列表数据' }
 *    
 *    7. initData 可以不请求接口，直接传递表格显示的数据
 * 
 *    8. styleObject 高度的配置（默认flex-grow: 1）
 * 
 *  column拓展配置：
 *    1. type = 'date' 格式化日期
 *     说明：会格式化时间戳的日期为字符串
 *     例子：
 *     { 
 *      prop: 'date', 
 *      label: '日期', 
 *      type: 'date' 
 *     }
 *      
 *    2. type = 'picture' 单元格显示图片
 *     说明：会在单元格显示图片，前提是列表字段包含图片的url
 *     例子：
 *     { 
 *      label: '图片', 
 *      type: 'picture',
 *      prop: 'priceSrc',       // 图片地址的Key
 *      fullProp: 'priceSrc',   // 大图片地址的Key，没有默认图片地址的Key
 *      showFull: true,         // 是否使用点击查看大图功能，默认使用
 *      style: 'width: 100px',  // 图片的style样式，默认width: 60px; height: 60px
 *     }
 *      
 *    3. type = 'iconOper' + lists = [{}] 
 *     说明： 操作按钮配置；点击图标，触发operationClick事件(参数1.事件类型; 参数2.scope)
 *     例子：
 *     { 
 *      label: '操作', 
 *      fixed: 'right',
 *      type: 'iconOper',
 *      lists: [
 *        {
 *          icon: 'icon-shanchu1',    // 按钮的图标样式
 *          title: '删除',            // 描述，鼠标移上去，会显示描述
 *          type: 'delete',           // 操作按钮的类型，用于区分点击哪一个操作按钮
 *          style: 'color: #F56C6C;', // 操作按钮的style样式，这里设置删除按钮颜色是红色（一般不需要设置）
 *          styleMethod: (row) => {   // 如果在特定的条件下，图标不能点击，需要设置置灰样式，可能需要用到该属性
 *            return 'color: #F56C6C;';
 *          }
 *        }
 *      ]
 *     }
 *        
 *    4. type = 'oper' + eventName = '事件名称' 
 *     说明：点击该行的单元格，会 $emit eventName对应值的事件；可以通过formatter和vHtml，来生成任意的样式)
 *     例子：
 *     {
 *      type: "oper",
 *      vHtml: true,
 *      eventName: '事件名称',
 *      formatter: (row, scope) => { return 'html标签'; }
 *     }
 * 
 *  未实现el-table组件的功能：
 *    1. 所有的插槽
 *    2. 树形数据与懒加载
 *    3. 多级表头、自定义表头
 *    4. 表尾合计行
 */
import {
  isArrObj,
  isFun,
  isObj,
  isArr,
  clone
} from '@/util/utils.js';

export default {
  data() {
    return {
      loading: true,

      // 列表显示图片的宽高
      imageDefaultStyle: 'width: 60px; height: 60px',

      thisPageOptions: {
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        pageSizes: [20, 30, 50],
        layout: 'total, sizes, prev, pager, next, jumper'
      },

      selectionData: [],

      // 绑定在el-table组件上的列表数据
      lists: [],

      // 排序参数
      sortParams: {
        orderField: '',
        orderType: ''
      },

      // 接口对象
      serviceObject: null
    };
  },

  props: {
    // 是否显示分页
    showPagination: {
      type: Boolean,
      default: true
    },

    // 分页信息（组件自定义的属性）
    pageOptions: {
      type: Object,
      default: _ => ({})
    },

    // 开启展开行功能
    expand: {
      type: Boolean,
      default: false
    },

    // 接口对象
    service: [Object, Array],

    // 查询列表的其他参数
    fieldParams: {
      type: Object,
      default: _ => ({})
    },

    // 查询列表的时候，总数的key
    totalKey: {
      type: Array,
      default: _ => ['total']
    },

    // 查询列表的时候，列表的key
    listKey: {
      type: Array,
      default: _ => ['list']
    },

    // 分页查询的key
    pageParamKey: {
      type: Object,
      default: _ => ({
        pageSize: 'pageSize',
        pageNumber: 'pageNumber'
      })
    },

    // 过滤查询条件
    filterParams: { type: Function },

    // 过滤返回数据
    filterList: { type: Function },

    // 表头数据 参考 element-ui table组件的 Table-column Attributes
    cols: { type: Array },

    // 初始化显示的数据，可以直接传递数据显示，而不需要请求接口
    initData: {
      type: [Object, Array],
      default: _ => ({
        lists: [],
        total: 0
      })
    },

    tableHeight: {
      type: String,
      default: '100%'
    },

    // 样式: 固定高度需要传递, 不然会默认父级元素使用flex，本身 flex-grow： 1 自适应
    styleObject: {
      type: Object,
      default: _ => ({})
    },
  },

  computed: {
    // 分页参数
    pageParams() {
      const { pageSize, pageNumber } = this.thisPageOptions;
      return !this.showPagination ? {} : {
        [this.pageParamKey.pageSize]: pageSize,
        [this.pageParamKey.pageNumber]: pageNumber
      };
    },

    style() {
      return {
        ...this.styleObject,
        flexGrow: this.styleObject.height ? 0 : 1
      };
    }
  },

  methods: {
    getTableRef() {
      return this.$refs.elTable;
    },

    deleteRowByIndex(index) {
      if (+index >= 0) this.lists.splice(index, 1);
    },

    selectAllRow(all) {
      this.selectionData = all;
    },

    selectRow(selection, row) {
      this.selectionData = selection;
    },

    // 获取选中的数据
    getSelectionData() {
      return clone(this.selectionData);
    },

    // 分页需要重新生成序号
    indexMethod(index) {
      index++;
      return (this.thisPageOptions.pageNumber - 1) * this.thisPageOptions.pageSize + index;
    },

    // 初始化分页的配置
    initPageOptions() {
      this.thisPageOptions = {
        ...this.thisPageOptions,
        ...this.pageOptions
      };
    },

    // 获取接口对象
    initServiceObject() {
      return new Promise((resolve, reject) => {
        if (isObj(this.service)) return resolve(this.service);
        if (!isArr(this.service)) return reject(this.service);

        const [path, key] = this.service;
        import(`@/api/${path}`)
          .then(rs => resolve(rs[key]))
          .catch(() => reject(this.service));
      });
    },

    // 获取查询参数
    getParams() {
      let sortParams = this.sortParams.orderField ? this.sortParams : {};
      if (isFun(this.filterParams)) {
        return {
          ...this.filterParams({
            sortParams,
            pageParams: this.pageParams,
          }),
          ...this.fieldParams
        };
      } else {
        return {
          ...sortParams,
          ...this.pageParams,
          ...this.fieldParams
        };
      }
    },

    getObjValueByKeys(obj, keys, defaultVal) {
      let val = obj;
      try {
        keys.forEach(key => { val = val[key]; });
        return val;
      } catch (e) {
        console.error(`请确定 ${obj} 对象是否存在属性 ${keys}`);
        return defaultVal;
      }
    },

    // 根据页数，获取列表数据
    refreshList(pageNumber) {
      if (pageNumber) this.pageOptions.pageNumber = pageNumber;
      this.$nextTick(_ => { this.queryTableList(); });
    },

    queryTableList() {
      let params = this.getParams();
      if (!this.service) return console.error('请传递参数service');

      this.$_api(this.serviceObject, params).then(data => {
        this.loading = false;
        // 父组件可以过滤查询出来的数据
        if (isFun(this.filterList)) {
          let _lists = this.filterList(data);
          if (isArrObj(_lists)) {
            this.lists = _lists;
          } else {
            this.lists = _lists.list;
            this.thisPageOptions.total = _lists.total;
          }
        } else if (isObj(data)) {
          this.lists = this.getObjValueByKeys(data, this.listKey, []);
          this.thisPageOptions.total = this.getObjValueByKeys(data, this.totalKey, 0);
        } else if (isArrObj(data)) {
          this.lists = data;
          this.thisPageOptions.total = 0;
        } else {
          this.lists = [];
          this.thisPageOptions.total = 0;
          console.error('请返回正确的数据格式： { 总数Key: Number, 列表Key: Array }');
        }
        this.selectionData = [];
      }).catch(e => {
        this.loading = false;
        this.tableList = [];
        this.selectionData = [];
        this.thisPageOptions.total = 0;
      });
    },

    _getText(col, scope) {
      return col.formatter ? col.formatter(scope.row, scope) : scope.row[col.prop];
    },

    _getPreviewSrcList(col, scope) {
      return col.showFull !== false ? [scope.row[col.fullProp] || scope.row[col.prop]] : [];
    }
  },

  created() {
    // 有初始化的数据
    if (isArrObj(this.initData) || isArrObj(this.initData.Lists)) {
      this.loading = false;
      this.lists = this.initData.Lists || this.initData;
      this.pageOptions.total = this.initData.total || 0;
    }

    // 没有传递接口
    if (!this.service) {
      if (!isArrObj(this.lists)) console.error('必须传入初始化数据initData，或者传入接口对象service');
      return;
    }

    this.initPageOptions();
    this.initServiceObject().then(serviceObj => {
      this.serviceObject = serviceObj;
      // 无初始化数据，需要请求接口获取数据
      if (!isArrObj(this.lists) && serviceObj) this.queryTableList();
    }).catch(e => {
      console.error('请检查service是否传递正确！格式：[api路径 + 文件名, 需要导出的对象的key]');
    });
  }
};
</script>

<style lang="scss" scoped>
.tableList {
  @include flexColumn();

  // 修复多选框位置偏低的bug
  /deep/ .el-table-column--selection .el-checkbox {
    display: flex;
  }

  /deep/ .icon.iconfont {
    color: $color-link;
    font-size: $font-size-large;
  }

  /deep/ .el-pagination {
    .el-pagination__sizes .el-input {
      line-height: normal;
    }
    input,
    button,
    .number,
    .el-icon.more {
      background-color: inherit;
    }
  }
}
</style>