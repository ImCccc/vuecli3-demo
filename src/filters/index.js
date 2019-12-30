import Vue from 'vue';
import moment from 'moment';
import { getVal } from '@/util/utils.js';
const filters = {
  /**
  * 时间搓转换成字符串格式日期
  * @param {NUmber} date 时间搓
  * @param {String} format 时间格式
  */
  formatDate: (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!date) return '';
    return moment(date).format(format);
  },

  /**
  * 针对对象数组，格式化显示数据
  * 例子： [{id: 'xxx', name: 'name1'},{id: 'xxx2', name: 'name2'] => name1,name2
  * 例子： {id: 'xxx', name: 'name1'} => name1
  */
  formatVal: (val, nameKey = 'name') => {
    return getVal(val, nameKey);
  },
};

for (let filter of Object.keys(filters)) {
  Vue.filter(filter, filters[filter]);
};