<template>
  <div>
    <van-sticky>
      <baseNavBar title="直接加支出"/>
    </van-sticky>

    <van-field
        v-model="content"
        name="content"
        label="内容"
        placeholder="请填写内容"
        required
        :rules="[{ required: true, message: '请填写内容'}]"
    />

    <!--支出发生日期。日期框 滚轮选择的-->
    <!--vant表单里的日历好像用不了。-->
    <van-field
        readonly
        clickable
        name="createDate"
        :value="createDate"
        label="支出发生日期"
        placeholder="点击选择支出发生日期"
        required
        @click="createDatePicker = true"
        :rules="[{ required: true, message: '请选择支出发生日期' }]"
    />
    <!--日期选择弹框-->
    <van-popup v-model="createDatePicker" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date"
                           @cancel="createDatePicker = false"
                           @confirm="onConfirmCreateDate"
                           :min-date="minCreateDate"
                           :max-date="maxCreateDate"
                           :formatter="formatter"/>
    </van-popup>

    <!--支出项目-->
    <van-field
        readonly
        clickable
        name="projectId"
        :value="projectText"
        label="支出项目"
        placeholder="点击选择支出项目"
        required
        @click="projectPicker = true"
        :rules="[{ required: true, message: '请选择支出项目' }]"
    />
    <van-popup v-model="projectPicker" position="bottom">
      <!--                        <van-search-->
      <!--                                v-model="projectSearchVal"-->
      <!--                                show-action-->
      <!--                                placeholder="请输入搜索关键词"-->
      <!--                                @search="projectOnSearch"-->
      <!--                                @cancel="projectSearchOnCancel"-->
      <!--                        />-->
      <van-picker
          show-toolbar
          :columns="projectArray"
          value-key="name"
          @cancel="projectPicker = false"
          @confirm="projectOnConfirm"
      />
    </van-popup>

    <!--店铺-->
    <van-field
        readonly
        clickable
        name="shopId"
        :value="shopText"
        label="店铺"
        placeholder="点击选择店铺"
        required
        @click="shopPicker = true"
        :rules="[{ required: true, message: '请选择店铺' }]"
    />
    <van-popup v-model="shopPicker" position="bottom">
      <van-picker
          show-toolbar
          :columns="shopArray"
          value-key="name"
          @cancel="shopPicker = false"
          @confirm="shopOnConfirm"
      />
    </van-popup>

    <!--支出金额-->
    <van-field
        v-model="spendAmount"
        name="spendAmount"
        type="number"
        label="支出金额"
        placeholder="请填写支出金额"
        required
        :rules="[{ required: true, message: '请填写支出金额' }]"
    />

    <!--报销人-->
    <van-field
        v-model="spendPeople"
        name="spendPeople"
        label="报销人"
        placeholder="请填写报销人"
        required
        :rules="[{ required: true, message: '请填写报销人'}]"
    />

    <van-field
        name="uploader"
        label="支出图片">
      <template #input>
        <van-uploader v-model="fileList" multiple :max-count="9"/>
      </template>
    </van-field>

    <!--公司结算方式-->
    <van-field
        readonly
        clickable
        name="spendMethodId"
        :value="spendMethodText"
        label="公司结算方式"
        placeholder="点击选择公司结算方式"
        required
        @click="spendMethodPicker = true"
        :rules="[{ required: true, message: '请选择公司结算方式' }]"
    />
    <van-popup v-model="spendMethodPicker" position="bottom">
      <van-picker
          show-toolbar
          :columns="spendMethodArray"
          value-key="name"
          @cancel="spendMethodPicker = false"
          @confirm="spendMethodOnConfirm"
      />
    </van-popup>


    <!--结算时间。选择完整时间，包括年月日和小时、分钟。 滚轮选择的-->
    <van-field
        readonly
        clickable
        name="spendMethodTime"
        :value="spendMethodTime"
        label="结算时间"
        placeholder="点击选择结算时间"
        required
        @click="spendMethodTimePicker = true"
        :rules="[{ required: true, message: '请选择结算时间' }]"
    />
<!--    &lt;!&ndash;完整时间选择弹框&ndash;&gt;-->
<!--    <van-popup v-model="spendMethodTimePicker" position="bottom">-->
<!--      <van-datetime-picker-->
<!--          v-model="spendMethodTime"-->
<!--          type="datetime"-->
<!--          title="选择完整时间"-->
<!--          :min-date="minSpendMethodTime"-->
<!--          :max-date="maxSpendMethodTime"-->
<!--          :formatter="formatter"-->
<!--      />-->

<!--&lt;!&ndash;      <van-datetime-picker v-model="currentDate" type="date"&ndash;&gt;-->
<!--&lt;!&ndash;                           @cancel="createDatePicker = false"&ndash;&gt;-->
<!--&lt;!&ndash;                           @confirm="onConfirmCreateDate" :min-date="minCreateDate" :max-date="maxCreateDate"&ndash;&gt;-->
<!--&lt;!&ndash;                           :formatter="formatter"/>&ndash;&gt;-->
<!--    </van-popup>-->

  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "directAddSpend",
  data() {
    return {
      content: '',
      spendAmount: '',
      spendPeople: '',
      // spendPeople: document.getElementById("empName").value, //老板要求报销人是 登录人。

      //发生日期
      createDate: this.$dateUtils.getTimeStr('d'), //老板要求支出发生日期默认今天。
      createDatePicker: false,
      minCreateDate: new Date(2018, 0, 1),
      maxCreateDate: new Date(),
      currentDate: new Date(),

      //支出项目
      projectId: "",
      projectText: "",
      projectArray: [],
      projectPicker: false,

      //店铺
      shopId: "",
      shopText: "",
      shopArray: [],
      shopPicker: false,

      //公司结算方式
      spendMethodId: "",
      spendMethodText: "",
      spendMethodArray: [],
      spendMethodPicker: false,

      //公司结算时间
      spendMethodTime: this.$dateUtils.getTimeStr('minute'),
      spendMethodTimePicker: false,
      minSpendMethodTime: new Date(2018, 0, 1, 0, 0),
      maxSpendMethodTime: new Date(),
      // currentTime: new Date(),

      spendId:"", //添加支出后返回的id
      fileList: [],
      spendImageStr: [],

      tenantCrop: localStorage.getItem("tenantCrop"),
      loading: false,
      finished: false,
    }
  }, components: {
    baseNavBar
  },
  methods: {

    formatter(type, value) {
      if (type === 'year') {
        this.value1 = value   // 可以拿到当前点击的数值
        return `${value}年`
      } else if (type === 'month') {
        this.value2 = value
        return `${value}月`
      } else if (type === 'day') {
        this.value3 = value
        return `${value}日`
      } else if (type === 'hour') {
        this.value3 = value
        return `${value}时`
      } else if (type === 'minute') {
        this.value3 = value
        return `${value}秒`
      }
    },

    //确认选中的支出发生日期
    onConfirmCreateDate: function () {
      this.createDate = `${this.value1}-${this.value2}-${this.value3}`  // 字符串拼接 结果如2020-07-01
      this.createDatePicker = false
    },

    //支出项目确认。
    projectOnConfirm: function (value) {
      this.projectId = value.value;
      this.projectText = value.name;
      this.projectPicker = false;
    },

    //店铺确认。
    shopOnConfirm: function (value) {
      this.shopId = value.value;
      this.shopText = value.name;
      this.shopPicker = false;
    },

    //公司结算方式确认。
    spendMethodOnConfirm: function (value) {
      this.spendMethodId = value.value;
      this.spendMethodText = value.name;
      this.spendMethodPicker = false;
    },

  },
}
</script>


