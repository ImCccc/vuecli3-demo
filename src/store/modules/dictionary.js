import { request } from '@/plugins/request.js';
import { dictionaryList } from '@/api/dictionary.js';
import { arrayToObjectTree, arrayToArrayTree, clone } from '@/util/utils.js';

export default {
  _name: 'dictionary',

  state: {
    /*
      dictionaryArray 数据结构:
      [
        {
          id: 1,
          parentId: 0,
          value: 'value1',
          children: [
            { id: 1, value: 1, parentId: 1}
          ]
        }
      ]
    */
    dictionaryArray: [],
    /*
      dictionaryObject 数据结构:
      {
        "value1": {
          id: 1,
          parentId: 0,
          value: 'value1',
          children: {
            [value值1]: { id: 1, parentId: 1, value: 1 },
            [value值2]: { id: 1, parentId: 1, value: 2 }
          }
        },
        "value2": {
          id: 2,
          parentId: 0,
          value: 'value1',
          children: { ... }
        }
      }
    */
    dictionaryObject: {},
  },

  getters: {
    dictionaryArray: state => state.dictionaryArray,

    dictionaryObject: state => state.dictionaryObject,

    /*
      根据value获取一级数据的children; 
      例子： this.$store.getters.dictionaryChildren(value)
    */
    dictionaryChildren: state => value => {
      try {
        return state.dictionaryArray.find(item => item.value === value).children;
      } catch (e) { return []; }
    }
  },

  actions: {
    initSource({ commit }) {
      return new Promise((resolve, reject) => {
        request(dictionaryList).then(({ data }) => {
          let { dictionary } = data;
          try {
            commit('SET_DATASOURCE_OBJECT', arrayToObjectTree(clone(dictionary))[0].children);
            commit('SET_DATASOURCE_ARRAY', arrayToArrayTree(dictionary)[0].children);
            resolve(true);
          } catch (e) {
            commit('SET_DATASOURCE_ARRAY', []);
            commit('SET_DATASOURCE_OBJECT', {});
            reject(new Error('初始化数据失败'));
          }
        });
      });
    }
  },

  mutations: {
    SET_DATASOURCE_ARRAY(state, data) {
      state.dictionaryArray = data;
    },

    SET_DATASOURCE_OBJECT(state, data) {
      state.dictionaryObject = data;
    }
  }
};
