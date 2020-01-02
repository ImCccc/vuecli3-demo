<template>
  <div class="h-100">
    <virtual-table
      :cols="cols"
      :list="list"
      @operTest="operTest"
    ></virtual-table>
  </div>
</template>

<script>
import VirtualTable from '@/components/virtual-table/VirtualTable.vue';

export default {
  data() {
    return {
      list: [],
      cols: [
        {
          type: 'selection',
          prop: '__selection'
        },

        // 表格配置
        {
          label: '序号',
          prop: 'name',
          align: 'center',
          width: '70',
        },

        {
          type: 'oper',
          label: '设备类型',
          eventName: 'operTest',
          vHtml: true,
          prop: 'oper',
          width: '200',
        },

        {
          type: 'date',
          label: '日期',
          prop: 'date',
          dateFormat: 'YYYY-MM-DD',
          width: '200',
        },

        {
          type: 'picture',
          label: '设备是否售出',
          prop: 'url',
          minWidth: '150',
        },

        {
          width: '120',
          label: '操作',
          align: 'center',
          type: 'iconOper',
          lists: [
            {
              type: 'releaseVersion',
              title: '分配版本',
              icon: 'icon-fenpei'
            },

            {
              type: 'versionDetails',
              title: '版本详情',
              icon: 'icon-chakan'
            }
          ]
        }
      ]
    };
  },

  components: {
    VirtualTable
  },

  methods: {
    operTest(scope, $event) {
      console.log(scope);
      console.log($event);
    },

    getList() {
      let a = [];
      let urls = {
        1: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570501473579.jpg',
        2: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570501440531.jpg',
        3: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570501449224.jpg',
        4: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570501454821.jpg',
        5: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570501469423.jpg',
        6: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570501501687.jpg',
        7: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/25黑洞引力.jpg',
        8: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570587019839.jpg',
        9: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570587019839.jpg',
        10: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570587019839.jpg',
        11: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570587019839.jpg',
        12: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570587019839.jpg',
        13: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570587019839.jpg',
        14: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570587019839.jpg',
        15: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570587019839.jpg',
        16: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570587019839.jpg',
        17: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570587019839.jpg',
        18: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/21咖喱鸡土豆盖饭.jpg',
        19: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/20香菇卤肉盖饭.jpg',
        20: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/19麻婆豆腐盖饭.jpg',
        21: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1568364695090.jpg',
        22: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1568364551513.jpg',
        23: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1574304007830.jpg',
        24: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1574304078052.jpg',
        25: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1574303941199.jpg',
        26: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1574304206322.jpg',
        27: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1574304145283.jpg',
        28: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/2鸡排1and1.jpg',
        29: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/5FOODOM鸡块.jpg',
        30: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1574303415134.jpg',
        31: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/3香辣鸡米花.jpg',
        32: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/4玉米甜心脆.jpg',
        33: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/6黄金鸡块and黑金鸡块and烤肠拼盘.jpg',
        34: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/7双翼飞行（A）奥尔良翅根and香辣鸡翅.jpg',
        35: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/25黑洞引力.jpg',
        36: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/23红色脉冲.jpg',
        37: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/22冰红茶.jpg',
        38: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1568365216765.jpg',
        39: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1568365017184.jpg',
        40: 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/18暴龙披萨.jpg',
      };

      for (let i = 1; i <= 500; i++) {
        a.push({
          name: i,
          __selection: false,
          date: new Date(),
          oper: Math.random(),
          url: urls[Math.ceil(Math.random() * 40)]
        });
      }
      this.list = a;
    }
  },

  mounted() {
    setTimeout(_ => {
      this.getList();
    }, 100);
  }
};
</script>

<style lang="scss" scoped>
</style>