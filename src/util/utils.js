export function isArrObj(data) {
  return (
    Object.prototype.toString.call(data) === '[object Array]' &&
    Object.prototype.toString.call(data[0]) === '[object Object]'
  );
}

export function isObj(data) {
  return Object.prototype.toString.call(data) === '[object Object]';
}

export function isFun(data) {
  return Object.prototype.toString.call(data) === '[object Function]';
}

export function isArr(data) {
  return Object.prototype.toString.call(data) === '[object Array]';
}

export function isStr(data) {
  return Object.prototype.toString.call(data) === '[object String]';
}

export function getVal(val, idKey = 'id') {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return val.trim();
  if (isArr(val)) return isObj(val[0]) ? val.map(item => item[idKey]).join(',') : val.join(',');
  if (isObj(val)) return val[idKey] || '';
  return val || '';
}

export function getValById(arr, id, ik = 'id', tk = 'name') {
  try { return arr.find(a => a[ik] === id)[tk]; } catch (error) { return ''; }
}

export const getValByObjKeys = (obj, keys, defVal = '') => {
  let val = obj;
  try {
    for (let key of keys) {
      val = val[key];
      if (!val && val !== 0) return '';
    }
    return val;
  } catch (e) { return defVal; }
};

export function clone(val, replacer) {
  return val instanceof Object ? JSON.parse(JSON.stringify(val, replacer)) : val;
}

export function getTextByHtml(html) {
  if (!html) return html;
  let objE = document.createElement('div');
  objE.innerHTML = html || '';
  return objE.textContent || objE.innerText;
}

/**
 * @explain        数组转对象
 * @param {*} arr  目标数组
 * @param {*} key  已数组元素的哪一个key作为对象的key
 */
export function arrayToObject(arr, key) {
  if (!isArr(arr)) return console.error('请输入数组！', arr);
  let obj = {};
  arr.map(item => {
    obj[item[key]] = obj[item[key]] || [];
    obj[item[key]].push(item);
  });
  return obj;
};

/**
 * @param {*} arr  转换的数组
 * @param {*} id   id的映射
 * @param {*} pid  父级id的映射
 * @explain        扁平化的数组转换为树结构, children 是数组
 * @example        传递参数[{ id: 1, pid: 0 },{ id: 2, pid: 0 },{ id: 11, pid: 1 },{ id: 12, pid: 1 },{ id: 111, pid: 11 }]试试
 */
export function arrayToArrayTree(arr, id = 'id', pid = 'parentId') {
  if (!isArr(arr)) return console.error('请输入数组！', arr);
  let obj = {};
  arr.map(v => {
    // 没有父级id默认初始化值 “noParentId” 
    v[pid] = (v[pid] === '' || v[pid] === null || v[pid] === undefined) ? '__noParentId__' : v[pid];
    if (obj[v[pid]]) {
      obj[v[pid]].children = obj[v[pid]].children || [];
      obj[v[pid]].children.push(v);
    } else {
      obj[v[pid]] = { children: [v] };
    }
    if (obj[v[id]]) v.children = obj[v[id]].children;
    obj[v[id]] = v;
  });
  return obj;
}

/**
 * @param {*} options.id   id的映射
 * @param {*} options.pid  父级id的映射
 * @param {*} options.key1  对象key的映射
 * @param {*} options.key2  对象key的映射（options.key1找不到的时候）
 * @explain        扁平化的数组转换为树结构, children是对象
 */
export const arrayToObjectTree = (arr, options = {}) => {
  if (!isArr(arr)) return console.error('请输入数组！', arr);
  let { id = 'id', pid = 'parentId', key1 = 'value', key2 = 'title' } = options;
  let obj = {};
  arr.map(v => {
    v[pid] = (v[pid] === '' || v[pid] === null || v[pid] === undefined) ? 0 : v[pid];
    if (obj[v[pid]]) {
      obj[v[pid]].children = obj[v[pid]].children || {};
      obj[v[pid]].children[v[key1] || v[key2]] = v;
    } else {
      obj[v[pid]] = {
        children: { [v[key1] || v[key2]]: v }
      };
    }
    if (obj[v[id]]) {
      v.children = obj[v[id]].children;
    }
    obj[v[id]] = v;
  });
  return obj;
};