<template>
  <div>
    <!--    顶部 以及收款记录-->
    <div>
      <switchNavBar title="添加收款" switchText="历史收款" @flag="proceedsHistoryShow=true"/>
      <van-popup v-model="proceedsHistoryShow" round position="bottom" :style="{ height: '60%' }">
        <van-collapse v-model="activeNames" style="padding:4% 4% 4% 4%">
          <van-collapse-item v-for="item in proceedsHistoryArray" :key="item.id"
                             :title="item.createDate+'\u3000\u3000'+item.proceedsName+'\u3000\u3000'+item.payee"
                             :name="item.id">
            <van-cell-group>
              <van-cell title="订单总价" :value="item.orderPrice"/>
              <van-cell title="收款金额" :value="item.spareMoney"/>
              <van-cell title="收款方式" :value="item.payment"/>
            </van-cell-group>
          </van-collapse-item>
        </van-collapse>
      </van-popup>
    </div>
    <!--    form-->
    <div>
      <van-notice-bar
          v-if="proceedsHistoryArray.length>0"
          left-icon="chat-o"
          @click="proceedsHistoryShow=true"
          :text="`该订单已有${proceedsHistoryArray.length}条收款。`"
      />
      <van-form @submit="addProceeds">

        <van-field
            readonly
            name="proceedsName"
            :value="proceedsNameText"
            label="收款项目"
            placeholder="点击选择收款项目"
            @click="proceedsNamePicker = true"
            :rules="[{ required: true }]"
        />
        <van-popup v-model="proceedsNamePicker" position="bottom">
          <van-picker
              getColumnValues
              show-toolbar
              :columns="proceedsNameArray"
              @confirm="proceedsNameConfirm"
              @cancel="proceedsNamePicker = false"
          />
        </van-popup>

        <van-field
            name="spareMoney"
            v-model="spareMoney"
            label="收款金额"
            type="digit"
            placeholder="请输入收款金额"
            :rules="[{ required: true }]"
        />

        <van-field
            readonly
            name="payee"
            :value="payeeText"
            label="收款人"
            placeholder="收款人"
            @click="payeePicker=true"
            :rules="[{ required: true }]"
        />
        <van-popup v-model="payeePicker" position="bottom">
          <van-picker
              getColumnValues
              show-toolbar
              :columns="payeeArray"
              @confirm="payeeConfirm"
              @cancel="payeePicker = false"
          />
        </van-popup>

        <van-field
            readonly
            name="createDate"
            :value="createDate"
            label="收款日期"
            placeholder="收款日期"
            :rules="[{ required: true }]"
            @click="createDatePicker=true"
        />
        <van-calendar v-model="createDatePicker" :min-date="minDate" :max-date="maxDate" @confirm="createDateConfirm"/>

        <van-field
            readonly
            name="payment"
            :value="paymentText"
            label="收款方式"
            placeholder="收款方式"
            :rules="[{ required: true }]"
            @click="paymentPicker=true"
        />
        <van-popup v-model="paymentPicker" position="bottom">
          <van-picker
              getColumnValues
              show-toolbar
              :columns="paymentArray"
              @confirm="paymentConfirm"
              @cancel="paymentPicker = false"
          />
        </van-popup>

        <van-field
            readonly
            name="proceedsRate"
            :value="proceedsRate"
            label="收款进度"
            placeholder="收款进度"
            :rules="[{ required: true }]"
        />

        <br>
        <br>
        <br>
        <br>
        <van-row>
          <van-col span="14" offset="5">
            <van-button round block type="primary" native-type="submit">提交</van-button>
          </van-col>
        </van-row>
      </van-form>
    </div>
  </div>
</template>

<script>

import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "proceeds-add",
  data() {
    return {
      id: this.$route.query.id,
      cusId: this.$route.query.cusId,
      tenantCrop: localStorage.getItem("tenantCrop"),
      orderPriceParent:this.$route.query.orderPrice,
      spareMoneyParent:this.$route.query.spareMoney,

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      activeNames: ['1'],
      proceedsHistoryShow: false,
      proceedsHistoryArray: [],

      proceedsNamePicker: false,
      payeePicker: false,
      createDatePicker: false,
      paymentPicker:false,

      proceedsNameArray: [],
      payeeArray: [],
      paymentArray: [],

      proceedsNameText: "",
      payeeText: "",
      paymentText: "",

      proceedsName: "",
      spareMoney: null,
      payee: "",
      createDate: this.$dateUtils.vantDateToYMD(new Date()),
      payment: "",
      proceedsRate:""

    }
  },
  components: {
    switchNavBar
  },
  created() {
    this.queryProceedsList();
    this.queryProjectsIds();
    this.queryPayeeIds();
    this.queryPaymentIds();
  },
  watch:{
    spareMoney:function (){
      let proportion = (Number(this.spareMoney)+Number(this.spareMoneyParent)) / Number(this.orderPriceParent);
      if (proportion >= 0 && proportion < 0.8) this.proceedsRate = "N->0-80%";
      else if (proportion < 1) this.proceedsRate = "D->80%-100%";
      else if (proportion === 1) this.proceedsRate = "W->100%";
      else this.proceedsRate = "X->小定"
    }
  },
  methods: {
    //收款项目确认
    proceedsNameConfirm: function (value) {
      this.proceedsNameText = value.text;
      this.proceedsName = value.id;
      this.proceedsNamePicker = false;
    },
    //收款人
    payeeConfirm: function (value) {
      this.payeeText = value.text;
      this.payee = value.id;
      this.payeePicker = false;
    },
    //收款时间确认
    createDateConfirm: function (time) {
      this.createDate = this.$dateUtils.vantDateToYMD(time);
      this.createDatePicker = false;
    },
    //收款方式确认
    paymentConfirm: function (value) {
      if (value[1] === "") {
        this.paymentText = value[0];
        this.payment = this.paymentArray.find(k => k.text === value[0]).id;
      } else {
        this.paymentText = value[1];
        this.payment = this.paymentArray.find(k => k.text === value[0]).children.find(k => k.text === value[1]).id;
      }
      this.paymentPicker = false;
    },

    //添加收款
    addProceeds: function (value) {
      value.orderId=this.id;
      value.cusId=this.cusId;
      value.tenantCrop=this.tenantCrop;
      value.payee=this.payee;
      value.payment=this.payment;
      value.proceedsName=this.proceedsName;
      value.orderPrice = this.orderPriceParent;
      console.log(value);
      this.$dialog.confirm({
        title: '添加收款',
        message: '是否确认给此订单添加 '+value.spareMoney+' 的收款?',
      }).then(() => {
        this.$axios({
          method:"GET",
          url:"/proceeds/saveProceeds",
          params:value
        }).then(response=>{
          if (response.data.code!==200){
            this.$toast.fail(response.data.msg);
            return;
          }
          this.$toast.success("添加成功");
          //todo
          // this.$dialog.confirm({
          //   title: '添加成功',
          //   message: '跳转到收款列表查看',
          // }).then(() => {
          //
          // })

        })
      })


    },


    //查询历史收款
    queryProceedsList: function () {
      this.$axios({
        method: "GET",
        url: "/proceeds/proceedsList",
        params: {
          orderId: this.id,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        if (response.data.total === 0) {
          this.$toast.fail("此订单无收款历史记录")
          return;
        }
        this.proceedsHistoryArray = response.data.data.list;
      })
    },
    //查询收款项目
    queryProjectsIds: function () {
      this.$selectUtils.queryAddProceedsProjects(
          this.$selectUtils.Picker
      ).then(response => {
        this.proceedsNameArray = JSON.parse(response.data.data);
      })
    },
    //查询收款人
    queryPayeeIds: function () {
      this.$selectUtils.queryPayeeIds(this.$selectUtils.Picker).then(response => {
        this.payeeArray = JSON.parse(response.data.data)
      })
    },
    //查询收款方式
    queryPaymentIds: function () {
      this.$selectUtils.queryPaymentIds(this.$selectUtils.Picker).then(response => {
        this.paymentArray = JSON.parse(JSON.parse(response.data.data));
        this.paymentArray = this.paymentArray.map(k => {
          if (k.children === null) {
            k.children = [{text: "", id: k.id}];
            return k;
          }
          return k;
        });
      })
    },
  }
}
</script>

<style scoped>

</style>
