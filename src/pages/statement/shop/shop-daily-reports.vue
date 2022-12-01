<template>
  <div>
    <van-sticky>
      <baseNavBar :title="titleText"/>
      <van-field
          readonly
          clickable
          label="日期："
          :value="date"
          placeholder="选择日期"
          @click="show = true"
      />
      <van-calendar
          v-model="show"
          type="range"
          @confirm="onConfirm1"
          allow-same-day
          :min-date="minDate"
      />

      <van-field
          readonly
          clickable
          label="礼服师："
          :value="dress"
          placeholder="选择礼服师"
          @click="showDress = true"
      />
      <van-popup v-model="showDress" round position="bottom">
        <van-picker
            show-toolbar
            :columns="dressList"
            @cancel="showDress = false"
            @confirm="onConfirm2"
            :loading="dressLoading"
        />
      </van-popup>

      <van-field
          readonly
          clickable
          label="店铺："
          :value="shop"
          placeholder="选择店铺"
          @click="showShop = true"
      />
      <van-popup v-model="showShop" round position="bottom">
        <van-picker
            show-toolbar
            :columns="shopList"
            @cancel="showShop = false"
            @confirm="onConfirm3"
            :loading="shopLoading"
        />
      </van-popup>
    </van-sticky>
    <div v-if="!loadingList">
      <br/><br/><br/>
      <van-loading color="#1989fa" vertical>加载中...</van-loading>
    </div>
    <van-collapse v-model="activeNames" v-else>
      <van-collapse-item title="店铺业绩" name="1" icon="shop-o">
        <van-grid :border="false" style="text-align: center">
            <van-grid-item @click="test1()">总业绩</van-grid-item>
            <van-grid-item>售前业绩</van-grid-item>
            <van-grid-item>售后业绩</van-grid-item>
            <van-grid-item>总营收</van-grid-item>
        </van-grid>
      </van-collapse-item>
      <van-collapse-item title="营收报告" name="2" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="4">
          <van-grid-item>押金</van-grid-item>
          <van-grid-item>售前业绩</van-grid-item>
          <van-grid-item>售后业绩</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
        </van-grid>
      </van-collapse-item>
      <van-collapse-item title="售前情况" name="3" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="3">
          <van-grid-item>押金</van-grid-item>
          <van-grid-item>售前业绩</van-grid-item>
          <van-grid-item>售后业绩</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
        </van-grid>
      </van-collapse-item>
      <van-collapse-item title="售后情况" name="4" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="3">
          <van-grid-item>押金</van-grid-item>
          <van-grid-item>售前业绩</van-grid-item>
          <van-grid-item>售后业绩</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
        </van-grid>
      </van-collapse-item>
      <van-collapse-item title="客资来源分析" name="5" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="4">
          <van-grid-item>押金</van-grid-item>
          <van-grid-item>售前业绩</van-grid-item>
          <van-grid-item>售后业绩</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
          <van-grid-item>总营收</van-grid-item>
        </van-grid>
      </van-collapse-item>
    </van-collapse>


    <van-popup
        v-model="test"
        closeable
        position="bottom"
        close-icon-position="top-right"
        style="height: 60%"
        round>
      <br/><br/>
      <van-collapse v-model="activeNames" :border="false">
        <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
        <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
        <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
        <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
        <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
        <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
        <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
        <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
        <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
        <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
        <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
        <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
        <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
        <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
        <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
        <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
        <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
        <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
        <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
        <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
        <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
        <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
        <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
        <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
        <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
        <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
        <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
      </van-collapse>
    </van-popup>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar";

export default {
  name: "shop-daily-reports",
  components: {
    baseNavBar
  },
  created() {

  },
  data() {
    return {
      test: false,
      titleText: "店铺每日业绩",
      loadingList: true,
      tenantCrop: localStorage.getItem("tenantCrop"),
      // 起始日期
      startDate: '',
      // 结束日期
      endDate: '',
      date: '',
      // 是否显示日期弹窗
      show: false,
      // 是否显示日历副标题
      showSubtitle: true,
      // 可选择的最早日期
      minDate: new Date(2018, 0, 1),
      // 是否显示礼服师下拉列表
      showDress: false,
      // 选择的礼服师
      dress: '',
      // 礼服师列表
      dressList: ['测试1', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
      // 是否正在加载礼服师
      dressLoading: false,
      // 是否显示店铺下拉列表
      showShop: false,
      // 选择的店铺
      shop: '',
      // 是否正在加载店铺
      shopLoading: false,
      // 店铺列表
      shopList: ['测试1', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
      activeNames: ['1','2','3','4','5'],

    }
  },
  methods: {
    test1() {
      this.test = true;
    },
    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm1(date) {
      const [start, end] = date;
      this.show = false;
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
      this.date = this.startDate + ' - ' + this.endDate;
    },
    onConfirm2(dress) {
      this.dress = dress;
      this.showDress = false;
    },
    onConfirm3(shop) {
      this.shop = shop;
      this.showShop = false;
    },
  }

}
</script>

<style scoped>

</style>