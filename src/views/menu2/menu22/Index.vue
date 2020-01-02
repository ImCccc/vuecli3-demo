<template>
  <div class="h-100">
    <virtual-table
      border
      :maxNumber="200"
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
          label: '图片',
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
      let urls = [
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570501473579.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570501440531.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570501449224.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570501454821.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570501469423.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570501501687.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/25黑洞引力.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1570587019839.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/21咖喱鸡土豆盖饭.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/20香菇卤肉盖饭.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/19麻婆豆腐盖饭.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1568364695090.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1568364551513.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1574304007830.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1574304078052.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1574303941199.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1574304206322.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1574304145283.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/2鸡排1and1.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/5FOODOM鸡块.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1574303415134.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/3香辣鸡米花.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/4玉米甜心脆.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/6黄金鸡块and黑金鸡块and烤肠拼盘.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/7双翼飞行（A）奥尔良翅根and香辣鸡翅.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/23红色脉冲.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/22冰红茶.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1568365216765.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/1568365017184.jpg',
        'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/18暴龙披萨.jpg',
      ];
      let urlsobj = urls.reduce((val, cur, index) => { val[index] = cur; return val; }, {});
      for (let i = 1; i <= 40000; i++) {
        a.push({
          name: i,
          __selection: false,
          date: new Date(),
          oper: Math.random(),
          url: urlsobj[Math.ceil(Math.random() * urls.length)] || 'http://qxjqr-oss-pro.oss-cn-shenzhen.aliyuncs.com/photo/fastfood/180x180/18暴龙披萨.jpg'
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