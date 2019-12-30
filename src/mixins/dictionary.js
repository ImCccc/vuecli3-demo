import { mapGetters } from 'vuex';
import { getValByObjKeys, isArr } from '@/util/utils.js';

export default {
  computed: {
    ...mapGetters(['dataSourceObject']),
  },

  methods: {
    /*
      keys: 传入数据字典的value数组；
      例子： 
      场景：获取 设备类型 -> 迎宾机器人(父级是设备类型) ->  小白(父级是迎宾机器人)
      参数：[设备类型value, 迎宾机器人的value, 小白的value]
    */
    $_getDictionary(keys, dataSource) {
      if (!isArr(keys)) return {};
      keys = keys.join(',children,').split(',');
      return getValByObjKeys(dataSource || this.dataSourceObject, keys, {});
    },

    // 快速获取数据字典的title, 参数和上面的方法一样
    $_getDictionaryTitle(keys, dataSource, defVal = '') {
      return this.$_getDictionary(keys, dataSource).title || defVal;
    },
  }
};
